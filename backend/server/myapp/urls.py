# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.handleFileUpload),
    path('playlist/', views.handlePlaylistUpload),
    path('latest_song/', views.handlePlaylistCheck),
#    path('example_single/', views.exampleSingleFile),
 #   path('example_playlist/', views.examplePlaylist),
  #  path('test_asgi/', views.sse_stream),
]
