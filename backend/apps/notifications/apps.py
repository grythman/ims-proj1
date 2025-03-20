from django.apps import AppConfig


class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.notifications'

    def ready(self):
        try:
            import apps.notifications.signals
            print("User signals registered successfully")
        except Exception as e:
            print(f"Error registering signals: {str(e)}")
