from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("executescript", views.executeScript, name="executeScript"),
    path("getallsteps", views.getAllSteps, name="getAllSteps"),
    path("savestep", views.saveStep, name="saveStep"),
    path("getallworkflows", views.getAllWorkflows, name="getAllWorkflows"),
    path("getworkflowbyid/<int:workflow_id>", views.getWorkflowByID, name="getWorkflowByID"),
    path("saveworkflow", views.saveWorkflow, name="saveWorkflow"),
    path("deletestep/<int:processor_id>", views.deleteStep, name="deleteStep"),
    path("deleteworkflow/<int:workflow_id>", views.deleteWorkflow, name="deleteWorkflow")
]
