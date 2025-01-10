from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from .models import User, NotificationPreference
from apps.notifications.services import NotificationService
from apps.internships.models import Report, Internship

@receiver(post_save, sender=User)
def user_post_save(sender, instance, created, **kwargs):
    if created:
        try:
            with transaction.atomic():
                # Create notification preferences
                NotificationPreference.objects.get_or_create(
                    user=instance,
                    defaults=NotificationPreference.get_default_preferences()
                )

                # Create welcome notification
                NotificationService.create_notification(
                    recipient=instance,
                    title='Welcome to IMS',
                    message=f'Welcome to the Internship Management System, {instance.get_full_name() or instance.username}!',
                    notification_type='system'
                )

                print(f"Created notification preferences for user {instance.username}")
        except Exception as e:
            print(f"Error in user_post_save signal: {str(e)}")

@receiver(post_save, sender=User)
def assign_user_permissions(sender, instance, created, **kwargs):
    if created:
        try:
            with transaction.atomic():
                # Get content types
                report_ct = ContentType.objects.get_for_model(Report)
                internship_ct = ContentType.objects.get_for_model(Internship)

                if instance.user_type == 'student':
                    # Student permissions
                    student_permissions = [
                        Permission.objects.get_or_create(
                            codename='view_own_reports',
                            name='Can view own reports',
                            content_type=report_ct,
                        )[0],
                        Permission.objects.get_or_create(
                            codename='submit_report',
                            name='Can submit reports',
                            content_type=report_ct,
                        )[0],
                        Permission.objects.get_or_create(
                            codename='view_own_internships',
                            name='Can view own internships',
                            content_type=internship_ct,
                        )[0],
                    ]
                    instance.user_permissions.add(*student_permissions)
                    print(f"Assigned student permissions to user {instance.username}")

                elif instance.user_type == 'teacher':
                    # Teacher permissions
                    teacher_permissions = [
                        Permission.objects.get_or_create(
                            codename='view_all_reports',
                            name='Can view all reports',
                            content_type=report_ct,
                        )[0],
                        Permission.objects.get_or_create(
                            codename='evaluate_reports',
                            name='Can evaluate reports',
                            content_type=report_ct,
                        )[0],
                        Permission.objects.get_or_create(
                            codename='manage_internships',
                            name='Can manage internships',
                            content_type=internship_ct,
                        )[0],
                    ]
                    instance.user_permissions.add(*teacher_permissions)
                    print(f"Assigned teacher permissions to user {instance.username}")

        except Exception as e:
            print(f"Error in assign_user_permissions signal: {str(e)}")

@receiver(post_save, sender=User)
def create_or_update_user_notification_preferences(sender, instance, created, **kwargs):
    if created:
        # Create NotificationPreference only if it doesn't exist
        NotificationPreference.objects.get_or_create(user=instance)
    else:
        # Update or perform actions on existing NotificationPreference
        preferences = NotificationPreference.objects.filter(user=instance).first()
        if preferences:
            # Update preferences or perform other actions
            pass