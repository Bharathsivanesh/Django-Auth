from django.urls import path
from .views import (

    RegisterView,LogoutView,NoteListCreateView,
NoteRetrieveDestroyView,AdminNoteListView,AdminNoteDeleteView,MyTokenObtainPairView)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns=[
    # JWT authentication
path('api/register/', RegisterView.as_view(), name='register'),
path('api/token/',  MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
path('api/logout/', LogoutView.as_view(), name='logout'),

#user Endpoints
path('api/notes/', NoteListCreateView.as_view(), name='notes_list_create'),#this is for "Get" notes and "post" notes
path('api/notes/<int:pk>/', NoteRetrieveDestroyView.as_view(), name='note-detail'), #this is for "delete" notes

#Admin Endpoints
path('api/admin/notes/', AdminNoteListView.as_view(), name='admin-notes-list'),
path('api/admin/notes/<int:pk>/', AdminNoteDeleteView.as_view(), name='admin-note-delete'),
]