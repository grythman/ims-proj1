from rest_framework import serializers
from .models import Organization
from django.contrib.auth import get_user_model

User = get_user_model()

class OrganizationSerializer(serializers.ModelSerializer):
    contact_person_name = serializers.CharField(source='contact_person.get_full_name', read_only=True)
    contact_person_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='contact_person', write_only=True, required=False)

    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'address', 'website', 'description',
            'contact_person_id', 'contact_person_name',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'contact_person_name']

    def create(self, validated_data):
        return Organization.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.address = validated_data.get('address', instance.address)
        instance.website = validated_data.get('website', instance.website)
        instance.description = validated_data.get('description', instance.description)
        contact_person = validated_data.get('contact_person', None)
        if contact_person:
            instance.contact_person = contact_person
        instance.save()
        return instance 