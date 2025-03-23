import json
from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes

from apps.users.models import User
from apps.internships.models import Internship, Task, Message
from apps.internships.services import generate_weekly_schedule


class ScheduleAPI(APIView):
    """
    Дадлагын хуваарь авах API
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """
        Тухайн хэрэглэгчийн дадлагын хуваарийн мэдээллийг буцаана.
        Уг мэдээлэлд дараах зүйлс багтана:
        - Долоо хоногийн стандарт хуваарь
        - Календарийн эвентүүд (уулзалт, хугацаа, даалгавар)
        """
        # Хэрэглэгчийн идэвхтэй дадлагыг олох
        try:
            student = request.user
            internship = Internship.objects.filter(
                student=student, 
                status=Internship.STATUS_ACTIVE
            ).select_related('mentor', 'organization').first()
            
            if not internship:
                return Response(
                    {"detail": "Идэвхтэй дадлага олдсонгүй"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Долоо хоногийн хуваарь
            weekly_schedule = self._generate_weekly_schedule(internship)
            
            # Календарийн эвентүүд
            events = self._generate_calendar_events(internship)
            
            response_data = {
                "internship_id": internship.id,
                "organization": internship.organization.name if hasattr(internship.organization, 'name') else "Unknown",
                "position": internship.title,
                "start_date": internship.start_date,
                "end_date": internship.end_date,
                "weekly_schedule": weekly_schedule,
                "events": events
            }
            
            return Response(response_data)
            
        except Exception as e:
            return Response(
                {"detail": f"Хуваарийн мэдээлэл авахад алдаа гарлаа: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _generate_weekly_schedule(self, internship):
        """
        Долоо хоногийн стандарт хуваарийг үүсгэх
        """
        # Дадлагын хуваарь байгаа эсэхийг шалгах
        # Хэрэв байвал түүнийг буцаах
        # Байхгүй бол жишээ хуваарь үүсгэх
        
        # Жишээ хуваарь - бодит системд өгөгдлийн сангаас авах ёстой
        weekly_schedule = [
            {
                "day": "Monday",
                "dayMn": "Даваа",
                "items": [
                    {"time": "09:00 - 12:00", "activity": "Дадлага - Онлайн", "location": "Зайнаас"},
                    {"time": "13:00 - 17:00", "activity": "Төслийн ажил", "location": "Оффис"}
                ]
            },
            {
                "day": "Tuesday",
                "dayMn": "Мягмар",
                "items": [
                    {"time": "09:00 - 12:00", "activity": "Дадлага - Онлайн", "location": "Зайнаас"},
                    {"time": "13:00 - 15:00", "activity": "Багийн уулзалт", "location": "Хурлын өрөө"},
                    {"time": "15:00 - 17:00", "activity": "Төслийн ажил", "location": "Оффис"}
                ]
            },
            {
                "day": "Wednesday",
                "dayMn": "Лхагва",
                "items": [
                    {"time": "09:00 - 12:00", "activity": "Дадлага - Онлайн", "location": "Зайнаас"},
                    {"time": "13:00 - 17:00", "activity": "Төслийн ажил", "location": "Оффис"}
                ]
            },
            {
                "day": "Thursday",
                "dayMn": "Пүрэв",
                "items": [
                    {"time": "09:00 - 12:00", "activity": "Дадлага", "location": "Оффис"},
                    {"time": "13:00 - 14:00", "activity": "Ментортой уулзалт", "location": "Хурлын өрөө"},
                    {"time": "14:00 - 17:00", "activity": "Төслийн ажил", "location": "Оффис"}
                ]
            },
            {
                "day": "Friday",
                "dayMn": "Баасан",
                "items": [
                    {"time": "09:00 - 12:00", "activity": "Дадлага", "location": "Оффис"},
                    {"time": "13:00 - 15:00", "activity": "Долоо хоногийн тайлан бэлтгэх", "location": "Оффис"},
                    {"time": "15:00 - 17:00", "activity": "Тайлан хүлээлгэн өгөх", "location": "Оффис"}
                ]
            }
        ]
        
        return weekly_schedule
    
    def _generate_calendar_events(self, internship):
        """
        Календарийн эвентүүдийг үүсгэх
        """
        events = []
        now = datetime.now()
        start_of_week = now - timedelta(days=now.weekday())
        
        # 1. Даалгавруудаас эвентүүд үүсгэх
        tasks = Task.objects.filter(internship=internship)
        for task in tasks:
            event = {
                "id": f"task_{task.id}",
                "title": task.title,
                "start_time": task.due_date.strftime("%Y-%m-%dT%H:%M:%S"),
                "end_time": (datetime.combine(task.due_date, datetime.min.time()) + timedelta(hours=1)).strftime("%Y-%m-%dT%H:%M:%S"),
                "type": "task",
                "description": task.description,
                "all_day": False
            }
            events.append(event)
        
        # 2. Стандарт эвентүүд нэмэх
        
        # Долоо хоногийн тайлан
        weekly_report = {
            "id": "weekly_report",
            "title": "Долоо хоногийн тайлан",
            "start_time": (start_of_week + timedelta(days=4, hours=15)).strftime("%Y-%m-%dT%H:%M:%S"),
            "end_time": (start_of_week + timedelta(days=4, hours=17)).strftime("%Y-%m-%dT%H:%M:%S"),
            "type": "deadline",
            "description": "Долоо хоногийн тайланг бэлтгэж илгээх",
            "all_day": False,
            "location": "Оффис"
        }
        events.append(weekly_report)
        
        # Ментортой уулзалт
        mentor_meeting = {
            "id": "mentor_meeting",
            "title": "Ментортой уулзалт",
            "start_time": (start_of_week + timedelta(days=3, hours=13)).strftime("%Y-%m-%dT%H:%M:%S"),
            "end_time": (start_of_week + timedelta(days=3, hours=14)).strftime("%Y-%m-%dT%H:%M:%S"),
            "type": "meeting",
            "description": "Долоо хоногийн явцын талаар ярилцах",
            "all_day": False,
            "location": "Хурлын өрөө",
            "participants": ["Ментор", "Оюутан"]
        }
        events.append(mentor_meeting)
        
        # Багийн уулзалт
        team_meeting = {
            "id": "team_meeting",
            "title": "Багийн уулзалт",
            "start_time": (start_of_week + timedelta(days=1, hours=13)).strftime("%Y-%m-%dT%H:%M:%S"),
            "end_time": (start_of_week + timedelta(days=1, hours=15)).strftime("%Y-%m-%dT%H:%M:%S"),
            "type": "meeting",
            "description": "Долоо хоногийн төлөвлөгөө хэлэлцэх",
            "all_day": False,
            "location": "Хурлын өрөө",
            "participants": ["Хөгжүүлэгчийн баг", "Та"]
        }
        events.append(team_meeting)
        
        # Эцсийн тайлан
        final_report = {
            "id": "final_report",
            "title": "Эцсийн тайлан илгээх",
            "start_time": internship.end_date.strftime("%Y-%m-%dT17:00:00"),
            "end_time": internship.end_date.strftime("%Y-%m-%dT17:00:00"),
            "type": "deadline",
            "description": "Дадлагын эцсийн тайланг илгээх",
            "all_day": True
        }
        events.append(final_report)
        
        # 3. Дараагийн долоо хоногт багштай уулзалт нэмэх
        teacher_meeting = {
            "id": "teacher_meeting",
            "title": "Багштай уулзалт",
            "start_time": (start_of_week + timedelta(days=10, hours=14)).strftime("%Y-%m-%dT%H:%M:%S"),
            "end_time": (start_of_week + timedelta(days=10, hours=15)).strftime("%Y-%m-%dT%H:%M:%S"),
            "type": "meeting",
            "description": "Дадлагын явцын хяналт",
            "all_day": False,
            "location": "Сургууль",
            "participants": ["Багш", "Оюутан"]
        }
        events.append(teacher_meeting)
        
        return events 