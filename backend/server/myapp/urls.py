# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.handleFileUpload),
    path('playlist/', views.handlePlaylistUpload),
]
