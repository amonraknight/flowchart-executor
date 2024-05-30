import copy
import types
import pickle


class WorkflowExecutor:
    def __init__(self):
        print('WorkflowExecutor initiated.')

    def executeWorkflow(self, inputWorkflowDict, inputExecutionType):
        message, log = '', ''

        rootStep = inputWorkflowDict['root']
        try:
            match inputExecutionType:
                case 'EXECUTE_ALL':
                    message, log = self._executeAllSince(rootStep)
                case 'EXECUTE_STEP':
                    # to continue
                    message, log = '', ''
                case 'EXECUTE_ALL_SINCE':
                    # to continue
                    message, log = '', ''
                case _:
                    message = 'The execution type "%s" is unknown.' % inputExecutionType
        except Exception as e:
            message = str(e)

        return message, log

    def _executeAllSince(self, inputWorkflowDict, globalVar={}, localVar={}):
        message, log = '', ''
        stepId = inputWorkflowDict['id']
        scriptStr = inputWorkflowDict['data']['pythonCode']
        print('Step ID: %s \nScript: %s ' % (stepId, scriptStr))
        exec(scriptStr, globalVar, localVar)

        # all children:
        children = inputWorkflowDict['children']
        if children and len(children) > 0:
            for eachChild in children:
                childGlobalVar = self._copyEnvVariables(globalVar)
                # Inherit all the modules, copy others.
                childLocalVar = self._copyEnvVariables(localVar)
                # print(pickle.dumps(childGlobalVar))
                self._executeAllSince(eachChild, childGlobalVar, childLocalVar)

        return message, log

    def _copyEnvVariables(self, lovalVar):
        copiedVars = {}
        for key, value in lovalVar.items():
            if isinstance(value, types.ModuleType):
                copiedVars[key] = value
        else:
            copiedVars[key] = copy.deepcopy(value)
        return copiedVars
