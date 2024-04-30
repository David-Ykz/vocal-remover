# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.handleFileUpload),
    path('playlist/', views.handlePlaylistUpload),
    path('latest_song/', views.handlePlaylistCheck),
    path('example_single/', views.handleExampleFile),
    path('example_playlist/', views.handleExamplePlaylist),
]
