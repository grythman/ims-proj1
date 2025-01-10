from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Organization(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    address = models.TextField(blank=True)
    contact_person = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='organizations',
        db_index=True
    )
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name'], name='organization_name_idx'),
            models.Index(fields=['contact_person'], name='organization_contact_person_idx'),
        ]

    def __str__(self):
        return self.name