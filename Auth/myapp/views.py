from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .serializers import UserSerializer
from .models import CustomUser
from .models import Note
from .serializers import NoteSerializer
from .permissions import IsAdminUserCustom
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

#Register user
class RegisterView(generics.CreateAPIView):
    queryset=CustomUser.objects.all()
    serializer_class=UserSerializer
    permission_classes=[permissions.AllowAny]


class NoteListCreateView(generics.ListCreateAPIView):

        serializer_class = NoteSerializer
        permission_classes = [permissions.IsAuthenticated]

        def get_queryset(self):
            # post user notes
            return Note.objects.filter(user=self.request.user).order_by('-updated_at')

        def perform_create(self, serializer):
            # Get user notes
            serializer.save(user=self.request.user)


class NoteRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    #Dlete user note
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow logged-in user to access their own notes
        return Note.objects.filter(user=self.request.user)

#ADMIN VIEWS

class AdminNoteListView(generics.ListAPIView):
    # Return all notes from all users
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUserCustom]

    def get_queryset(self):
        return Note.objects.all().order_by('-updated_at')

class AdminNoteDeleteView(generics.DestroyAPIView):
    # Admin can delete any note
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUserCustom]

    def get_queryset(self):

        return Note.objects.all()



class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token is None:
                return Response({"error": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    #cutom beacus of addedd "user_type" field in resposne