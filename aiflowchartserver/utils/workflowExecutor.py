import copy
import types
import pickle
import sys
from io import StringIO


class WorkflowExecutor:
    def __init__(self):
        print('WorkflowExecutor initiated.')

    def executeWorkflow(self, inputWorkflowDict, inputExecutionType):
        exeResult = {}

        rootStep = inputWorkflowDict['root']

        match inputExecutionType:
            case 'EXECUTE_ALL':
                exeResult, treeHasException = self._executeAllSince(rootStep)
            case 'EXECUTE_STEP':
                # to continue
                exeResult = {}
                treeHasException = 0
            case 'EXECUTE_ALL_SINCE':
                # to continue
                exeResult = {}
                treeHasException = 0
            case _:
                exeResult = {
                    'error': 'The execution type "%s" is unknown.' % inputExecutionType
                }
                treeHasException = 0

        return exeResult, treeHasException

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
            exec(scriptStr, globalVar, localVar)
            error = ''
        except Exception as e:
            error = str(e)
            thisStepException = 1

        log = sys.stdout.getvalue()
        sys.stdout = backup_stdout

        exeResult = {
            'stepId': stepId,
            'log': log,
            'error': error,
            'encounterException': thisStepException
        }

        # all children:
        children = inputWorkflowDict['children']

        # Stop if has exception or has no children.
        if thisStepException == 0 and children and len(children) > 0:
            childrenExeResultList = []
            for eachChild in children:
                childGlobalVar = self._copyEnvVariables(globalVar)
                # Inherit all the modules, copy others.
                childLocalVar = self._copyEnvVariables(localVar)
                # print(pickle.dumps(childGlobalVar))
                childExeResult, childHasException = self._executeAllSince(eachChild, childGlobalVar, childLocalVar)
                if childHasException == 1:
                    treeHasException = 1
                childrenExeResultList.append(childExeResult)
            exeResult['children'] = childrenExeResultList

        else:
            treeHasException = thisStepException

        return exeResult, treeHasException

    def _copyEnvVariables(self, lovalVar):
        copiedVars = {}
        for key, value in lovalVar.items():
            if isinstance(value, types.ModuleType):
                copiedVars[key] = value
        else:
            copiedVars[key] = copy.deepcopy(value)
        return copiedVars
