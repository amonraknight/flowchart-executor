import json

def parseJsonString(jsonStr, objClass):
	# print(jsonStr)
	# print(type(jsonStr))
	dictData = json.loads(jsonStr)
	result = objClass()
	result.__dict__ = dictData
	return result