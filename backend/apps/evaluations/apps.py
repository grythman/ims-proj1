from django.apps import AppConfig


class EvaluationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.evaluations'
    label = 'evaluations'

    def ready(self):
        try:
            import apps.evaluations.signals  # noqa
        except ImportError as e:
            print(f"Warning: Error importing evaluations signals: {str(e)}")
