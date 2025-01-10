from django.contrib import admin
from .models import Organization

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_person', 'created_at')
    search_fields = ('name', 'contact_person__username', 'contact_person__email')
    list_filter = ('created_at',)
    date_hierarchy = 'created_at'
