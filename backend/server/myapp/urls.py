# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.testConnection),
    path('upload/', views.handleFile),
]
