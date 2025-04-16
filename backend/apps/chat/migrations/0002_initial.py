# Generated by Django 4.2.7 on 2025-04-16 08:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('chat', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='sender',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chat_messages', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='chatroomparticipant',
            name='chat_room',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chat.chatroom'),
        ),
        migrations.AddField(
            model_name='chatroomparticipant',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='chatroom',
            name='participants',
            field=models.ManyToManyField(related_name='chat_rooms', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddIndex(
            model_name='messageattachment',
            index=models.Index(fields=['message', 'created_at'], name='chat_messag_message_a261d7_idx'),
        ),
        migrations.AddIndex(
            model_name='message',
            index=models.Index(fields=['room', 'created_at'], name='chat_messag_room_id_5feac5_idx'),
        ),
        migrations.AddIndex(
            model_name='message',
            index=models.Index(fields=['sender', 'is_read'], name='chat_messag_sender__7ea760_idx'),
        ),
        migrations.AddIndex(
            model_name='chatroomparticipant',
            index=models.Index(fields=['chat_room', 'user'], name='chat_chatro_chat_ro_bcdbb3_idx'),
        ),
        migrations.AddIndex(
            model_name='chatroomparticipant',
            index=models.Index(fields=['user', 'last_read_at'], name='chat_chatro_user_id_4bd13a_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='chatroomparticipant',
            unique_together={('chat_room', 'user')},
        ),
        migrations.AddIndex(
            model_name='chatroom',
            index=models.Index(fields=['room_type'], name='chat_chatro_room_ty_0e9cce_idx'),
        ),
        migrations.AddIndex(
            model_name='chatroom',
            index=models.Index(fields=['-updated_at'], name='chat_chatro_updated_fe8347_idx'),
        ),
    ]
