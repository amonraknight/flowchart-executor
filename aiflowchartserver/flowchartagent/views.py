from django.http import HttpResponse, JsonResponse, Http404, HttpResponseServerError
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json

from utils.jsonutil import parseJsonString
from objects.requestToExecution import RequestToExecution
from objects.requestToSaveProcessor import RequestToSaveProcessor
from objects.requestToSaveWorkflow import RequestToSaveWorkflow
from flowchartagent.models import CustomizedProcessor, Workflow
from objects.generalResponseBody import GeneralResponseBody

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from flowchartagent.tasks import executeWorkflow as celExecuter


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


'''
Request sample:

{
	"executionType": "EXECUTE_ALL",
	"flow": "{\n    \"root\": {\n        \"id\": \"s1714177496863\",\n        \"type\": \"process-step\",\n        \"data\": {\n            \"name\": \"Process Step 1\",\n            \"prompt\": \"\",\n            \"pythonCode\": \"import pandas as pd\\n\\ncsv_file_path = 'E:/testfield/python/iristest/data/iris.data'\\ndf = pd.read_csv(csv_file_path)\",\n            \"loopOver\": \"\",\n            \"focused\": true\n        },\n        \"children\": [\n            {\n                \"id\": \"s1714177889309\",\n                \"type\": \"process-step\",\n                \"data\": {\n                    \"name\": \"Process Step 2\",\n                    \"prompt\": \"\",\n                    \"pythonCode\": \"output_file_path = 'E:/testfield/python/iristest/data/iris.csv'\\ndf.to_csv(output_file_path, index=False)\",\n                    \"loopOver\": \"\",\n                    \"focused\": false\n                },\n                \"children\": []\n            },\n            {\n                \"id\": \"s1714178143901\",\n                \"type\": \"process-step\",\n                \"data\": {\n                    \"name\": \"Process Step 3\",\n                    \"prompt\": \"\",\n                    \"pythonCode\": \"filtered_df = df[df.iloc[:, 4] == 'Iris-setosa']\\n\",\n                    \"loopOver\": \"\",\n                    \"focused\": false\n                },\n                \"children\": [\n                    {\n                        \"id\": \"s1714178453655\",\n                        \"type\": \"process-step\",\n                        \"data\": {\n                            \"name\": \"Process Step 4\",\n                            \"prompt\": \"\",\n                            \"pythonCode\": \"output_file_path = 'E:/testfield/python/iristest/data/iris_setosa.csv'\\nfiltered_df.to_csv(output_file_path, index=False)\",\n                            \"loopOver\": \"\",\n                            \"focused\": false\n                        },\n                        \"children\": []\n                    }\n                ]\n            }\n        ]\n    },\n    \"connectors\": []\n}"
}
'''

@csrf_exempt
def executeScriptAsync(request):
    if request.method == 'POST':
        requestToExecution = parseJsonString(request.body, RequestToExecution)

        workflowDict = json.loads(requestToExecution.flow)
        rootStep = workflowDict['root']
        clientID = requestToExecution.clientID

        # Bring the result to a asynchronous task.
        rlt = celExecuter.delay(inputWorkflowDict=rootStep, clientID=clientID)

        data = {'task_id': rlt.task_id}
        response = GeneralResponseBody(message="Workflow starts to execute.", status=1, data=data)

        return JsonResponse(response.getResponseBody())
    else:
        Http404("Request method should be POST.")


@csrf_exempt
def getAllSteps(request):
    if request.method == 'GET':

        allProcessors = CustomizedProcessor.objects.all()

        processorList = []

        for eachProcessor in allProcessors:
            processorDict = json.loads(eachProcessor.step_json)
            processorDict['id'] = eachProcessor.processor_id

            processorList.append(processorDict)

        data = {
            'processors': processorList
        }

        response = GeneralResponseBody(message='Processors acquired.', data=data)

        return JsonResponse(response.getResponseBody())
    else:
        Http404("Request method should be GET.")


@csrf_exempt
def getAllWorkflows(request):
    # Return the id, name and description.
    if request.method == 'GET':
        allWorkflows = Workflow.objects.all()

        workflowList = []

        for eachWorkflow in allWorkflows:
            workflowDict = {
                'workflow_id': eachWorkflow.workflow_id,
                'workflow_name': eachWorkflow.workflow_name,
                'description': eachWorkflow.description,
                'creater_id': eachWorkflow.creater_id,
                'create_date': eachWorkflow.create_date,
                'update_date': eachWorkflow.update_date
            }

            workflowList.append(workflowDict)

        data = {
            'workflows': workflowList
        }

        response = GeneralResponseBody(message='Workflows acquired.', data=data)

        return JsonResponse(response.getResponseBody())

    else:
        Http404("Request method should be GET.")


@csrf_exempt
def getWorkflowByID(request, workflow_id):
    if request.method == 'GET':
        print('Wanted workflow_id: %d' % workflow_id)
        try:
            targetWorkflow = Workflow.objects.get(pk=workflow_id)
        except Workflow.DoesNotExist:
            Http404("Workflow not found.")

        workflowDict = {
            'workflow_id': targetWorkflow.workflow_id,
            'workflow_name': targetWorkflow.workflow_name,
            'description': targetWorkflow.description,
            'workflow_json': json.loads(targetWorkflow.workflow_json)
        }

        data = {
            'workflow': workflowDict
        }

        response = GeneralResponseBody(message='Workflow acquired.', data=data)

        return JsonResponse(response.getResponseBody())
    else:
        Http404("Request method should be GET.")


'''
Request sample:

{
	"processorName": "Repetative Step",
	"createrID": 1,
	"data": {
		"name": "Repetative Step",
		"prompt": "",
		"pythonCode": "import os",
		"loopOver": "",
		"focused": false
	}
}
'''


@csrf_exempt
def saveStep(request):
    if request.method == 'POST':
        requestToSaveProcessor = parseJsonString(request.body, RequestToSaveProcessor)

        if hasattr(requestToSaveProcessor, 'id') and requestToSaveProcessor.id:
            # Existing item
            try:
                step = CustomizedProcessor.objects.get(pk=requestToSaveProcessor.id)
            except CustomizedProcessor.DoesNotExist:
                # Http404('Processor in ID %d not found.' % requestToSaveProcessor.id)
                step = CustomizedProcessor()
        else:
            # new item
            step = CustomizedProcessor()

        # Fill the content
        step.processor_name = requestToSaveProcessor.processorName
        step.description = ''
        step.creater_id = requestToSaveProcessor.createrID
        step.step_json = json.dumps(requestToSaveProcessor.data)

        step.save()

        response = GeneralResponseBody(message='Processor saved.', data={'processorID': step.processor_id})

        return JsonResponse(response.getResponseBody())
    else:
        Http404("Request method should be POST.")


@csrf_exempt
def saveWorkflow(request):
    if request.method == 'POST':
        requestToSaveWorkflow = parseJsonString(request.body, RequestToSaveWorkflow)

        # 0 is the filler workflow ID when it is not in DB yet.
        if hasattr(requestToSaveWorkflow, 'workflowID') and requestToSaveWorkflow.workflowID > 0:
            # Existing item
            try:
                workflow = Workflow.objects.get(pk=requestToSaveWorkflow.workflowID)
            except Workflow.DoesNotExist:
                # Http404('Workflow in ID %d not found.' % requestToSaveWorkflow.workflowID)
                workflow = Workflow()
                workflow.create_date = timezone.now()
        else:
            # new item
            workflow = Workflow()
            workflow.create_date = timezone.now()

        # Fill details
        workflow.workflow_name = requestToSaveWorkflow.workflowName
        workflow.workflow_json = requestToSaveWorkflow.workflowJson
        workflow.description = requestToSaveWorkflow.description
        workflow.creater_id = requestToSaveWorkflow.createrID
        workflow.update_date = timezone.now()

        workflow.save()

        response = GeneralResponseBody(message='Workflow saved.')

        return JsonResponse(response.getResponseBody())

    else:
        Http404("Request method should be POST.")


@csrf_exempt
def deleteStep(request, processor_id):
    if request.method == 'DELETE':
        try:
            processorToDelete = CustomizedProcessor.objects.get(pk=processor_id)
        except CustomizedProcessor.DoesNotExist:
            return HttpResponseServerError('Processor in ID %d not found.' % processor_id)
        else:
            processorToDelete.delete()

            response = GeneralResponseBody(message='Processor deleted.', data={'processorID': processor_id})

        return JsonResponse(response.getResponseBody())

    else:
        Http404("Request method should be DELETE.")


@csrf_exempt
def deleteWorkflow(request, workflow_id):
    if request.method == 'DELETE':
        try:
            workflowToDelete = Workflow.objects.get(pk=workflow_id)
        except Workflow.DoesNotExist:
            return HttpResponseServerError('Workflow in ID %d not found.' % workflow_id)
        else:
            workflowToDelete.delete()

            response = GeneralResponseBody(message='Workflow deleted.', data={'workflowID': workflow_id})

        return JsonResponse(response.getResponseBody())
    else:
        Http404("Request method should be DELETE.")

'''
@csrf_exempt
def sendMessage(request, message_text):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)("client_1", {"type": "backend.message", "text": message_text})
    return JsonResponse({"message": "A piece of message."})
'''