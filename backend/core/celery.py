import os
from celery import Celery
from django.conf import settings
from celery.schedules import crontab

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Create the Celery app
app = Celery('core')

# Configure Celery using Django settings
app.config_from_object('django.conf:settings', namespace='CELERY')

# Set broker URL
app.conf.broker_url = 'amqp://guest:guest@localhost:5672//'

# Configure result backend
app.conf.result_backend = 'django-db'

# Configure task serialization
app.conf.task_serializer = 'json'
app.conf.result_serializer = 'json'
app.conf.accept_content = ['json']
app.conf.timezone = 'UTC'

# Configure task routing
app.conf.task_routes = {
    'apps.companies.tasks.send_webhook': {'queue': 'webhooks'},
    'apps.companies.tasks.retry_failed_webhooks': {'queue': 'webhooks'},
}

# Configure task default rate limits
app.conf.task_default_rate_limit = '100/s'

# Configure task specific settings
app.conf.task_annotations = {
    'apps.companies.tasks.send_webhook': {
        'rate_limit': '50/s',
        'max_retries': 3,
        'default_retry_delay': 60,  # 1 minute
    },
    'apps.companies.tasks.retry_failed_webhooks': {
        'rate_limit': '10/m',
    },
}

# Configure periodic tasks
app.conf.beat_schedule = {
    'retry-failed-webhooks': {
        'task': 'apps.companies.tasks.retry_failed_webhooks',
        'schedule': crontab(minute='*/5'),  # Every 5 minutes
    },
}

# Auto-discover tasks from all installed apps
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS) 