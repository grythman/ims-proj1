# Generated by Django 4.2.7 on 2025-04-16 08:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('evaluations', '0001_initial'),
        ('internships', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='evaluation',
            name='evaluated_student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_evaluations', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='evaluation',
            name='evaluator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='given_evaluations', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='evaluation',
            name='internship',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='evaluations', to='internships.internship'),
        ),
        migrations.AlterUniqueTogether(
            name='evaluationscore',
            unique_together={('evaluation', 'criteria')},
        ),
    ]
