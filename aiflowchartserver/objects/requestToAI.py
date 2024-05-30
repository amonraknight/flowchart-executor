class RequestToAI:
	def __init__(self, inputPredecessorScripts=None, inputMessages=None):
		if inputPredecessorScripts:
			self.predecessorScripts = inputPredecessorScripts
		else:
			self.predecessorScripts = []
		
		if inputMessages:
			self.messages = inputMessages
		else:
			self.messages = []
		
		
	