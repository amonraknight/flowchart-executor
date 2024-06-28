import time

from flowchartagent.models import Workflow
from flowchartagent.tasks import executeWorkflow as celExecuter
from celery import result
from celeryapp.celery import app


class WorkflowExecutor:
    def __init__(self):
        print('WorkflowExecutor initiated.')

    def executeWorkflow(self, inputWorkflowDict, inputExecutionType):

        rootStep = inputWorkflowDict['root']

        match inputExecutionType:
            case 'EXECUTE_ALL':
                rlt = celExecuter.delay(rootStep)

                # Make it asynchronnized later. Not able to get the results this way.
                # executedWorkflow, treeHasException = rlt.get(timeout=20)

                print(rlt.task_id)

                asyncResult = result.AsyncResult(rlt.task_id, app=app)
                while not asyncResult.ready():
                    time.sleep(1)

                executedWorkflow, treeHasException = asyncResult.get()

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
