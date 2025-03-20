from django.apps import AppConfig


class InternshipsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.internships'
    verbose_name = 'Internships'

    def ready(self):
        try:
            import apps.internships.signals
            print("Internship signals registered successfully")
        except Exception as e:
            print(f"Error registering internship signals: {str(e)}")
