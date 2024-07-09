# This file must be named as "tasks.py". Otherwise Celery will not be able to find it.

from celery import shared_task
import sys
from io import StringIO
import copy
import types
import json
from concurrent.futures import ThreadPoolExecutor

from flowchartagent.models import Workflow
from utils.importextracter import getImportScript
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


@shared_task
def executeWorkflow(inputWorkflowDict, clientID=1):
    workflowDict, treeHasException = _executeAllSince(inputWorkflowDict)

    if treeHasException == 1:
        message = "Encountered an exception!"
        # Script exception
        status = 2
    else:
        message = "All scripts have executed successfully."
        status = 1

    # Push the result to the front end.
    channel_layer = get_channel_layer()
    print('Execution finished. client_%s' % clientID)
    print(channel_layer)
    async_to_sync(channel_layer.group_send)(
        "client_%s" % clientID,
        {"type": "backend.message", "message": message, "status": status, "data": {'root': workflowDict}}
    )


def _executeAllSince(inputWorkflowDict, globalVar={}, localVar={}):
    thisStepException = 0
    treeHasException = 0

    stepId = inputWorkflowDict['id']

    if inputWorkflowDict['type'] == 'process-step':

        scriptStr = inputWorkflowDict['data']['pythonCode']
        print('Step ID: %s \nScript: %s ' % (stepId, scriptStr))

        # Redirect the log.
        backup_stdout = sys.stdout
        sys.stdout = StringIO()
        try:
            libLocalVar = {}

            # Prepare the import of libraries, get put the lib to global var.
            libImportScript = getImportScript(scriptStr)
            exec(libImportScript, {}, libLocalVar)
            globalVar.update(libLocalVar)

            exec(scriptStr, globalVar, localVar)
            error = ''
        except Exception as e:
            error = str(e)
            thisStepException = 1

        log = sys.stdout.getvalue()
        sys.stdout = backup_stdout

    elif inputWorkflowDict['type'] == 'subworkflow-step':
        # Execute a sub-workflow

        subworkflowID = inputWorkflowDict['data']['subworkflowId']
        targetWorkflow = Workflow.objects.get(pk=subworkflowID)
        targetWorkflowDict = json.loads(targetWorkflow.workflow_json)['root']

        # Not to support the handing over of variables.
        subworkflowDict, thisStepException = _executeAllSince(targetWorkflowDict)

        # Prepare the log and error
        log, error = _getAllLogAndErrorAlongTree(subworkflowDict)

    # Collect log and exceptions
    inputWorkflowDict['data']['log'] = log
    inputWorkflowDict['data']['error'] = error
    inputWorkflowDict['data']['hasError'] = thisStepException

    # all children:
    children = inputWorkflowDict['children']

    # Stop if has exception or has no children.
    if thisStepException == 0 and children and len(children) > 0:
        executedChildrenWF = []
        childrenJobList = []

        # Inherit all the modules, copy others.
        childGlobalVar = _copyEnvVariables(globalVar)
        childLocalVar = _copyEnvVariables(localVar)

        # Execute all children in a concurrent way.
        with ThreadPoolExecutor(3) as pool:
            for eachChild in children:
                childJob = pool.submit(_executeAllSince, eachChild, childGlobalVar, childLocalVar)
                childrenJobList.append(childJob)

        for eachJob in childrenJobList:
            childWorkflow, childHasException = eachJob.result()
            if childHasException == 1:
                treeHasException = 1
            executedChildrenWF.append(childWorkflow)
        inputWorkflowDict['children'] = executedChildrenWF

    else:
        # Don't touch the children if not exists or not to execute.
        treeHasException = thisStepException

    return inputWorkflowDict, treeHasException


def _copyEnvVariables(lovalVar):
    copiedVars = {}
    for key, value in lovalVar.items():
        if isinstance(value, types.ModuleType):
            copiedVars[key] = value
        else:
            copiedVars[key] = copy.deepcopy(value)
    return copiedVars


def _getAllLogAndErrorAlongTree(workflowTreeDict):
    stepLog = workflowTreeDict['data']['log']
    stepError = workflowTreeDict['data']['error']

    childrenWorkflows = workflowTreeDict['children']

    for eachSubWorkflowDict in childrenWorkflows:
        subLog, subError = _getAllLogAndErrorAlongTree(eachSubWorkflowDict)
        stepLog = stepLog + ' --- \n' + subLog
        stepError = stepError + ' --- \n' + stepError

    return stepLog, stepError
