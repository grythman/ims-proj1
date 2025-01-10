from django.utils import timezone
from django.template import Template, Context
from django.db import models
from .models import Report, ReportTemplate
import os
from django.conf import settings
from django.template.loader import render_to_string
from django.core.files import File
from weasyprint import HTML
from docx import Document
from docx.shared import Inches
from apps.notifications.services import NotificationService

class ReportService:
    @staticmethod
    def create_from_template(template_id, student, internship, **kwargs):
        """Create a new report from a template."""
        template = ReportTemplate.objects.get(id=template_id)
        
        # Process template content
        content_template = Template(template.content_template)
        context = Context({
            'student': student,
            'internship': internship,
            'date': timezone.now(),
            **kwargs
        })
        processed_content = content_template.render(context)

        # Create report
        return Report.objects.create(
            title=f"{template.name} - {timezone.now().strftime('%Y-%m-%d')}",
            content=processed_content,
            student=student,
            mentor=internship.mentor,
            internship=internship,
            type=template.report_type
        )

    @staticmethod
    def get_report_statistics(user):
        """Get report statistics for a user."""
        reports = Report.objects.filter(student=user)
        return {
            'total': reports.count(),
            'pending': reports.filter(status='pending').count(),
            'approved': reports.filter(status='approved').count(),
            'rejected': reports.filter(status='rejected').count(),
            'draft': reports.filter(status='draft').count(),
            'completion_rate': reports.filter(status='approved').count() / reports.count() * 100 if reports.exists() else 0
        }

    @staticmethod
    def get_mentor_statistics(user):
        """Get report review statistics for a mentor."""
        reports = Report.objects.filter(mentor=user)
        return {
            'total_assigned': reports.count(),
            'pending_review': reports.filter(status='pending').count(),
            'reviewed': reports.exclude(status='pending').count(),
            'average_review_time': reports.filter(review_date__isnull=False).aggregate(
                avg_time=models.Avg(models.F('review_date') - models.F('submission_date'))
            )['avg_time']
        }

    @staticmethod
    def generate_report_pdf(report):
        """Generate PDF report with proper formatting."""
        context = {
            'report': report,
            'student': report.student,
            'mentor': report.mentor,
            'internship': report.internship,
            'generated_date': timezone.now(),
            'university_info': settings.UNIVERSITY_INFO
        }

        html_string = render_to_string('reports/report_template.html', context)
        html = HTML(string=html_string)
        
        output_file = f'report_{report.id}_{timezone.now().strftime("%Y%m%d")}.pdf'
        output_path = os.path.join(settings.MEDIA_ROOT, 'reports', output_file)
        html.write_pdf(
            output_path,
            stylesheets=[settings.REPORT_CSS],
            presentational_hints=True
        )

        return f'reports/{output_file}'

    @staticmethod
    def generate_report_template(report_type, internship):
        """Generate report template based on type."""
        if report_type == 'weekly':
            return generate_weekly_report_template(internship)
        elif report_type == 'monthly':
            return generate_monthly_report_template(internship)
        elif report_type == 'final':
            return generate_final_report_template(internship)
        return generate_default_report_template()

    @staticmethod
    def process_submission(report):
        """Process report submission with notifications."""
        try:
            # Generate PDF version
            report.file = ReportService.generate_report_pdf(report)
            report.submission_date = timezone.now()
            report.status = 'pending'
            report.save()

            # Notify mentor
            if report.mentor:
                NotificationService.create_notification(
                    recipient=report.mentor,
                    title='New Report Submission',
                    message=f'New {report.get_type_display()} report submitted by {report.student.get_full_name()}',
                    notification_type='report'
                )

            return True
        except Exception as e:
            print(f"Error processing report submission: {str(e)}")
            return False

    @staticmethod
    def process_review(report, reviewer, status, feedback=None):
        """Process report review with notifications."""
        try:
            report.status = status
            report.feedback = feedback
            report.review_date = timezone.now()
            report.save()

            # Notify student
            NotificationService.create_notification(
                recipient=report.student,
                title=f'Report {status.title()}',
                message=f'Your {report.get_type_display()} report has been {status}',
                notification_type='report'
            )

            # Update internship progress if needed
            if status == 'approved':
                update_internship_progress(report.internship)

            return True
        except Exception as e:
            print(f"Error processing report review: {str(e)}")
            return False

def generate_weekly_report_template(internship):
    """Generate weekly report template."""
    return f"""
    Weekly Progress Report
    Student: {internship.student.get_full_name()}
    Week: [Week Number]
    Period: [Start Date] to [End Date]

    1. Activities Completed This Week:
    - 
    - 
    -

    2. Learning Outcomes:
    - 
    - 
    -

    3. Challenges Encountered:
    - 
    - 
    -

    4. Solutions Implemented:
    - 
    - 
    -

    5. Next Week's Plans:
    - 
    - 
    -

    6. Hours Logged:
    Monday: 
    Tuesday: 
    Wednesday: 
    Thursday: 
    Friday: 
    Total Hours: 

    7. Additional Notes:
    
    8. Questions for Mentor:
    - 
    - 
    -

    9. Resources Used:
    - 
    - 
    -
    """

def generate_monthly_report_template(internship):
    """Generate monthly report template."""
    return f"""
    Monthly Progress Report
    Student: {internship.student.get_full_name()}
    Month: [Month]
    Period: [Start Date] to [End Date]

    1. Executive Summary:

    2. Major Accomplishments:
    - 
    - 
    -

    3. Skills Developed:
    - Technical Skills:
        - 
        - 
    - Soft Skills:
        - 
        - 

    4. Project Progress:
    - Project 1:
        - Status:
        - Achievements:
        - Challenges:
    - Project 2:
        - Status:
        - Achievements:
        - Challenges:

    5. Learning Outcomes:
    - 
    - 
    -

    6. Challenges and Solutions:
    - Challenge 1:
        - Solution:
        - Outcome:
    - Challenge 2:
        - Solution:
        - Outcome:

    7. Hours Summary:
    - Week 1: 
    - Week 2: 
    - Week 3: 
    - Week 4: 
    Total Monthly Hours: 

    8. Goals for Next Month:
    - 
    - 
    -

    9. Additional Comments:
    """

def generate_final_report_template(internship):
    """Generate final report template."""
    return f"""
    Final Internship Report
    Student: {internship.student.get_full_name()}
    Organization: {internship.organization.name}
    Period: {internship.start_date} to {internship.end_date}

    1. Executive Summary:

    2. Organization Overview:
    - Description:
    - Industry:
    - Department:
    - Role:

    3. Projects and Responsibilities:
    - Project 1:
        - Description:
        - Role:
        - Achievements:
        - Technologies Used:
    - Project 2:
        - Description:
        - Role:
        - Achievements:
        - Technologies Used:

    4. Skills Development:
    - Technical Skills:
        - 
        - 
    - Soft Skills:
        - 
        - 
    - Industry Knowledge:
        - 
        - 

    5. Learning Outcomes:
    - Academic Application:
        - 
        - 
    - Professional Growth:
        - 
        - 
    - Personal Development:
        - 
        - 

    6. Challenges and Solutions:
    - Major Challenges:
        - 
        - 
    - Solutions Implemented:
        - 
        - 
    - Lessons Learned:
        - 
        - 

    7. Contributions to Organization:
    - 
    - 
    -

    8. Future Recommendations:
    - For Future Interns:
        - 
        - 
    - For the Organization:
        - 
        - 
    - For the University:
        - 
        - 

    9. Conclusion:

    10. Acknowledgments:
    """

def generate_default_report_template():
    """Generate default report template."""
    return """
    Report Title:
    Date:
    
    1. Introduction:

    2. Main Content:
    - 
    - 
    -

    3. Conclusion:

    4. Additional Notes:
    """

def update_internship_progress(internship):
    """Update internship progress based on approved reports."""
    from apps.internships.models import Internship
    # Implement progress update logic
    pass