class RequestToSaveWorkflow:
    def __init__(self, inputWorkflowName=None, inputDescription=None, inputJson=None, inputCreaterID=None, inputID=None):
        self.workflowID = inputID
        self.workflowName = inputWorkflowName
        self.description = inputDescription
        self.workflowJson = inputJson
        self.createrID = inputCreaterID
