from celery import shared_task
import sys
from io import StringIO
import copy
import types
import json

from flowchartagent.models import Workflow
from utils.importextracter import getImportScript

@shared_task
def add(x, y):
    return x + y


@shared_task
def mul(x, y):
    return x * y


@shared_task
def xsum(numbers):
    return sum(numbers)


@shared_task
def executeWorkflow(inputWorkflowDict):
    workflowDict, treeHasException = _executeAllSince(inputWorkflowDict)
    return workflowDict, treeHasException


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
        for eachChild in children:
            childGlobalVar = _copyEnvVariables(globalVar)
            # Inherit all the modules, copy others.
            childLocalVar = _copyEnvVariables(localVar)
            # print(pickle.dumps(childGlobalVar))
            childWorkflow, childHasException = _executeAllSince(eachChild, childGlobalVar, childLocalVar)
            if childHasException == 1:
                treeHasException = 1
            executedChildrenWF.append(childWorkflow)
        inputWorkflowDict['children'] = executedChildrenWF

    else:
        # Don't touch the children if not exists or not to execute.
        treeHasException = thisStepException

    return inputWorkflowDict, treeHasException


def _copyEnvVariables(self, lovalVar):
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