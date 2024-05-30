class RequestToExecution:
	def __init__(self, inputExecutionType=None, inputFlow=None):
		if inputExecutionType:
			self.executionType = inputExecutionType
		else:
			self.executionType = 'EXECUTE_ALL'
		
		if inputFlow:
			self.flow = inputFlow
		else:
			self.flow = None
		
		
	