from django.contrib import admin
from .models import CustomizedProcessor, Workflow, ResultVariables

admin.site.register(CustomizedProcessor)
admin.site.register(Workflow)
admin.site.register(ResultVariables)
