from django.http import HttpResponse, JsonResponse, Http404, HttpResponseServerError
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json

from utils.jsonutil import parseJsonString
from utils.workflowExecutor import WorkflowExecutor
from objects.requestToExecution import RequestToExecution
from objects.requestToSaveProcessor import RequestToSaveProcessor
from objects.requestToSaveWorkflow import RequestToSaveWorkflow
from flowchartagent.models import CustomizedProcessor, Workflow, ResultVariables

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
def executeScript(request):
	if request.method == 'POST':
		requestToExecution = parseJsonString(request.body, RequestToExecution)
		
#		print(requestToExecution.flow)
		
		workflowDict = json.loads(requestToExecution.flow)
#		print(workflowDict)
		workflowExecutor = WorkflowExecutor()
		message, log = workflowExecutor.executeWorkflow(workflowDict, requestToExecution.executionType)
		body = {
		  'message': message,
		  'log': log
		}
		
		return JsonResponse(body)
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

		responseBody = {
			'message': 'Processors acquired.',
			'processors': processorList
		}

		return JsonResponse(responseBody)
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
				'description': eachWorkflow.description
			}

			workflowList.append(workflowDict)

		responseBody = {
			'message': 'Workflows acquired.',
			'processor': workflowList
		}

		return JsonResponse(responseBody)

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
			'step_json': json.loads(targetWorkflow.step_json)
		}

		responseBody = {
			'message': 'Workflow acquired.',
			'workflow': workflowDict
		}

		return JsonResponse(responseBody)
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
				Http404('Processor in ID %d not found.' % requestToSaveProcessor.id)
		else:
			# new item
			step = CustomizedProcessor()

		# Fill the content
		step.processor_name = requestToSaveProcessor.processorName
		step.description = ''
		step.creater_id = requestToSaveProcessor.createrID
		step.step_json = json.dumps(requestToSaveProcessor.data)

		step.save()

		responseBody = {
			'status': 1,
			'message': 'Processor saved.',
			'data': {'processorID': step.processor_id}
		}

		return JsonResponse(responseBody)
	else:
		Http404("Request method should be POST.")


@csrf_exempt
def saveWorkflow(request):
	if request.method == 'POST':
		requestToSaveWorkflow = parseJsonString(request.body, RequestToSaveWorkflow)

		if hasattr(requestToSaveWorkflow, 'workflowID') and requestToSaveWorkflow.workflowID:
			# Existing item
			try:
				workflow = Workflow.objects.get(pk=requestToSaveWorkflow.workflowID)
			except Workflow.DoesNotExist:
				Http404('Workflow in ID %d not found.' % requestToSaveWorkflow.workflowID)
		else:
			# new item
			workflow = Workflow()

		# Fill details
		workflow.workflow_name = requestToSaveWorkflow.workflowName
		workflow.workflow_json = requestToSaveWorkflow.workflowJson
		workflow.description = requestToSaveWorkflow.description
		workflow.creater_id = requestToSaveWorkflow.createrID
		workflow.create_date = timezone.now
		workflow.update_date = timezone.now

		workflow.save()

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
			responseBody = {'status': 1, 'message': 'Processor deleted.', 'data': {'processorID': processor_id}}
		return JsonResponse(responseBody)
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
			responseBody = {'workflowID': workflow_id, 'message': 'Workflow deleted.'}
		return JsonResponse(responseBody)
	else:
		Http404("Request method should be DELETE.")

