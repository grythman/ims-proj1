from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import openai
from django.conf import settings

# Create your views here.

class AIChatView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Get message and context from request
            message = request.data.get('message')
            context = request.data.get('context', {})
            role = request.data.get('role', 'student')
            
            if not message:
                return Response(
                    {'error': 'Message is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Set OpenAI API key
            openai.api_key = settings.OPENAI_API_KEY
            
            # Build system message based on context
            system_message = self._build_system_message(role, context)
            
            # Get chat completion from OpenAI
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": message}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            # Extract AI response
            ai_message = response.choices[0].message.content
            
            return Response({
                'message': ai_message
            })
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _build_system_message(self, role, context):
        """Build system message based on role and context"""
        base_message = "You are an AI assistant helping with the internship management system. "
        
        if role == 'student':
            if context.get('type') == 'report_assistant':
                return base_message + """You are helping students write better internship reports.
                Provide specific, actionable advice and suggestions for improvement.
                Be encouraging but also point out areas that need work.
                Use examples and templates when helpful."""
                
        elif role == 'mentor':
            if context.get('type') == 'evaluation_assistant':
                return base_message + """You are helping mentors evaluate their students effectively.
                Focus on providing objective evaluation criteria and constructive feedback.
                Help mentors identify key areas to assess and suggest specific improvements.
                Consider both technical skills and soft skills in evaluations."""
                
        elif role == 'teacher':
            return base_message + """You are helping teachers oversee internship programs.
            Provide guidance on program management, student progress tracking, and evaluation standards.
            Help identify areas where students or mentors may need additional support."""
            
        return base_message + "Provide helpful and relevant information based on the user's needs."
