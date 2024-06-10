import copy
import types
import pickle
import sys
from io import StringIO

from utils.importextracter import getImportScript


class WorkflowExecutor:
    def __init__(self):
        print('WorkflowExecutor initiated.')

    def executeWorkflow(self, inputWorkflowDict, inputExecutionType):

        rootStep = inputWorkflowDict['root']

        match inputExecutionType:
            case 'EXECUTE_ALL':
                executedWorkflow, treeHasException = self._executeAllSince(rootStep)
            case 'EXECUTE_STEP':
                # to continue
                executedWorkflow = rootStep
                treeHasException = 0
            case 'EXECUTE_ALL_SINCE':
                # to continue
                executedWorkflow = rootStep
                treeHasException = 0
            case _:
                executedWorkflow = rootStep
                treeHasException = 0

        return {'root': executedWorkflow}, treeHasException

    def _executeAllSince(self, inputWorkflowDict, globalVar={}, localVar={}):

        thisStepException = 0
        treeHasException = 0

        stepId = inputWorkflowDict['id']
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

        inputWorkflowDict['data']['log'] = log
        inputWorkflowDict['data']['error'] = error
        inputWorkflowDict['data']['hasError'] = thisStepException

        # all children:
        children = inputWorkflowDict['children']

        # Stop if has exception or has no children.
        if thisStepException == 0 and children and len(children) > 0:
            executedChildrenWF = []
            for eachChild in children:
                childGlobalVar = self._copyEnvVariables(globalVar)
                # Inherit all the modules, copy others.
                childLocalVar = self._copyEnvVariables(localVar)
                # print(pickle.dumps(childGlobalVar))
                childWorkflow, childHasException = self._executeAllSince(eachChild, childGlobalVar, childLocalVar)
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
