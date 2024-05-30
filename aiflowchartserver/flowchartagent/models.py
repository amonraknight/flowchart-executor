from django.db import models


# Preserve a step.
class CustomizedProcessor(models.Model):
    processor_id = models.BigAutoField(primary_key=True)
    processor_name = models.CharField(max_length=30)
    description = models.CharField(max_length=500)
    creater_id = models.BigIntegerField()
    # script_text = models.TextField(db_comment='The script of a step.')
    step_json = models.JSONField()


# Preserve the workflows.
class Workflow(models.Model):
    workflow_id = models.BigAutoField(primary_key=True)
    workflow_name = models.CharField(max_length=30)
    description = models.CharField(max_length=500)
    creater_id = models.BigIntegerField()
    create_date = models.DateTimeField(db_comment='date created')
    update_date = models.DateTimeField(db_comment='date of last update')
    workflow_json = models.JSONField()


# Preserve the result variables serialized.
class ResultVariables(models.Model):
    variables_id = models.BigAutoField(primary_key=True)
    workflow_id = models.ForeignKey('Workflow', on_delete=models.CASCADE)
    executer_id = models.BigIntegerField()
    create_date = models.DateTimeField(db_comment='date created')
    update_date = models.DateTimeField(db_comment='date of last update')
    seriallized_variables = models.TextField(db_comment='The variables preserved.')
