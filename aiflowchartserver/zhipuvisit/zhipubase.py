from zhipuai import ZhipuAI
from django.conf import settings
import time


class ZhipuBase:

    def __init__(self):
        with open('zhipuvisit/apikey.txt', 'r', encoding='utf-8') as file:
            self.api_key = file.read()

        self.zhipuClient = ZhipuAI(api_key=self.api_key)
        print('Zhipu client initialized.')

    def get_zhipu_response(self, input_messages, input_tools=None):
        #		print('Messages to Zhipu: ')
        #		print(input_messages)
        #		print(type(input_messages[0]))

        if settings.ZHIPU_IS_ASYNC:
            first_response = self.zhipuClient.chat.asyncCompletions.create(
                model=settings.ZHIPU_MODEL,
                messages=input_messages,
                tools=input_tools,
                stop=settings.ZHIPU_STOP_SIGNS
            )

            task_id = first_response.id
            task_status = ''
            get_cnt = 0
            while task_status != 'SUCCESS' and task_status != 'FAILED' and get_cnt <= settings.ZHIPU_MAX_RETRY:
                response = self.zhipuClient.chat.asyncCompletions.retrieve_completion_result(id=task_id)
                print(response)
                task_status = response.task_status
                time.sleep(settings.ZHIPU_RETRY_INTERVAL)
                get_cnt += 1

        else:
            response = self.zhipuClient.chat.completions.create(
                model=settings.ZHIPU_MODEL,
                messages=input_messages,
                tools=input_tools,
                stop=settings.ZHIPU_STOP_SIGNS
            )
        return response


'''
Sample response:
model='glm-4' created=1713706858 choices=[CompletionChoice(index=0, finish_reason='stop', message=CompletionMessage(content='Certainly! To read a CSV file in Python, you can use the `csv` module which is part of Python\'s standard library. Below is an example of how you can read a CSV file located at `C:\\file.csv`:\n\n```python\nimport csv\n\n# Define the path to your CSV file\ncsv_file_path = "C:\\\\file.csv"\n\n# Open the CSV file\nwith open(csv_file_path, mode=\'r\', encoding=\'utf-8\') as file:\n    # Create a CSV reader\n    csv_reader = csv.reader(file)\n    \n    # Iterate through each row in the CSV file\n    for row in csv_reader:\n        print(row)  # row is a list of values from the current line in the CSV file\n\n# If you want to skip the header, you can do something like this:\nwith open(csv_file_path, mode=\'r\', encoding=\'utf-8\') as file:\n    csv_reader = csv.reader(file)\n    next(csv_reader)  # Skip the header row\n    for row in csv_reader:\n        print(row)\n```\n\nThe `csv.reader` object reads the file and returns each row as a list. If your CSV file has a header, you might want to skip it by using `next(csv_reader)` as shown in the second example.\n\nRemember that file paths on Windows can also be specified with forward slashes or double backslashes (`\\\\`), and you may need to handle exceptions for cases where the file does not exist or is not readable.', role='assistant', tool_calls=None))] request_id='8581415026264255388' id='8581415026264255388' usage=CompletionUsage(prompt_tokens=34, completion_tokens=309, total_tokens=343)
'''
