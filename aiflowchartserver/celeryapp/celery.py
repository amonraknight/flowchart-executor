import os
from celery import Celery

# Make sure that you are using the same settings.py as the Django project.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aiflowchartserver.settings')

# If not providing the backend and broker here, the Django server is not able to acquire the settings.
# app = Celery('celeryjob', backend='redis://localhost:6379/1', broker='redis://localhost:6379/0')
app = Celery('celeryjob')

# app.conf.broker_url = 'redis://localhost:6379/0'
# app.conf.result_backend = 'redis://localhost:6379/1'

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
# Needs to provide the apps having "tasks.py".
app.autodiscover_tasks(['flowchartagent'])

'''
@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
'''