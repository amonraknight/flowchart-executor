from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import re

from utils.jsonutil import parseJsonString
from objects.requestToAI import RequestToAI
from zhipuvisit.zhipubase import ZhipuBase


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


'''
Request sample:

{
	"predecessorScripts": [
		"# Assuming the data is already loaded into the variable 'dataframe'\\n\\nclass_counts = dataframe['Class'].value_counts().to_dict()"
	],
	"messages": [
		{
			"role": "user",
			"message": "asdasd"
		}
	]
}
'''


@csrf_exempt
def getAIReply(request):
    # Initialize Zhipu base
    if settings.ZHIPUBASE == None:
        settings.ZHIPUBASE = ZhipuBase()

    #	print("request method: "+request.method)
    #	print("request body: ")
    #	print(request.body)
    if request.method == 'POST':
        requestToAI = parseJsonString(request.body, RequestToAI)
        #		print(requestToAI)

        messages = _createZhipuMessages(requestToAI)
        #		print(messages)

        response = settings.ZHIPUBASE.get_zhipu_response(messages)
        #		print(response)
        scriptStrs, messageStrs = _parseZhipuResponse(response)
        #		print(scriptStrs)
        #		print(messageStrs)

        codereply = ''
        messagereply = ''

        for eachScript in scriptStrs:
            codereply = codereply + '\n' + eachScript

        for eachMessage in messageStrs:
            messagereply = messagereply + '\n' + eachMessage

        body = {
            "codereply": codereply,
            "messagereply": messagereply
        }

        return JsonResponse(body)
    else:
        Http404("Request method should be POST.")


# Prepare the request messages to Zhipu.
def _createZhipuMessages(inputRequestToAI):
    messages = []
    messages.append({'role': 'system', 'content': 'The user wants you to write Python according to his purpose.'})
    if inputRequestToAI.predecessorScripts:
        scriptList = list(reversed(inputRequestToAI.predecessorScripts))
        for eachScript in scriptList:
            messages.append({'role': 'assistant', 'content': str(eachScript)})

    if inputRequestToAI.messages:
        messages.extend(inputRequestToAI.messages)

    return messages


'''
Certainly! Below is a simple Python script using the pandas library to read a CSV file into a DataFrame. Make sure you have pandas installed in your Python environment. If not, you can install it using pip:\n\n```bash\npip install pandas\n```\n\nHere\'s the Python script:\n\n```python\nimport pandas as pd\n\ndef read_csv_to_dataframe(file_path):\n    try:\n        # Read the CSV file into a pandas DataFrame\n        df = pd.read_csv(file_path)\n        return df\n    except FileNotFoundError:\n        print(f"The file at {file_path} was not found.")\n    except pd.errors.ParserError as e:\n        print(f"An error occurred while parsing the file: {e}")\n    except Exception as e:\n        print(f"An unexpected error occurred: {e}")\n\n# Replace \'path_to_your_file.csv\' with the actual path to your CSV file\nfile_path = \'path_to_your_file.csv\'\ndata_frame = read_csv_to_dataframe(file_path)\n\n# If the file was read successfully, print the DataFrame\nif data_frame is not None:\n    print(data_frame)\n```\n\nReplace `\'path_to_your_file.csv\'` with the actual path to the CSV file you want to read. The function `read_csv_to_dataframe` will handle the file reading, and it includes basic error handling to catch common issues like file not found and parsing errors.\n\nRemember to adjust the error handling according to your needs or add more specific error handling based on the kind of CSV files you are working with.
'''


def _parseZhipuResponse(inputResponse):
    content = inputResponse.choices[0].message.content

    scriptStrs, otherMessages = [], []

    codeMark1 = '```python'
    codeMark2 = '```'

    contentRemain = content
    while contentRemain and contentRemain.find(codeMark1) >= 0:
        position = contentRemain.find(codeMark1)
        # Get chat
        if position > 0:
            otherMessages.append(contentRemain[:position])
            contentRemain = contentRemain[position + len(codeMark1):]

        # Get script
        if contentRemain.find(codeMark2) > 0:
            position = contentRemain.find(codeMark2)
            scriptStrs.append(contentRemain[:position])
            contentRemain = contentRemain[position + len(codeMark2):]

    otherMessages.append(contentRemain)

    return scriptStrs, otherMessages
