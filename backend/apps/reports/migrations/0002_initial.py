# Generated by Django 4.2.7 on 2025-04-16 08:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('reports', '0001_initial'),
        ('internships', '0002_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='reporttemplate',
            name='created_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_templates', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='reportcomment',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='reportcomment',
            name='report',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='reports.report'),
        ),
        migrations.AddField(
            model_name='report',
            name='internship',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='report_set', to='internships.internship'),
        ),
        migrations.AddField(
            model_name='report',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reports', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddIndex(
            model_name='reporttemplate',
            index=models.Index(fields=['report_type', 'is_active'], name='reports_rep_report__11a031_idx'),
        ),
        migrations.AddIndex(
            model_name='reportcomment',
            index=models.Index(fields=['report', 'created_at'], name='reports_rep_report__32ad4d_idx'),
        ),
        migrations.AddIndex(
            model_name='reportcomment',
            index=models.Index(fields=['author', 'created_at'], name='reports_rep_author__6c00c5_idx'),
        ),
        migrations.AddIndex(
            model_name='report',
            index=models.Index(fields=['student', 'status'], name='reports_rep_student_007e0c_idx'),
        ),
        migrations.AddIndex(
            model_name='report',
            index=models.Index(fields=['internship', '-created_at'], name='reports_rep_interns_d821bf_idx'),
        ),
    ]
