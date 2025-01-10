from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'
    verbose_name = 'Users'

    def ready(self):
        try:
            import apps.users.signals
            print("User signals registered successfully")
        except Exception as e:
            print(f"Error registering user signals: {str(e)}")
