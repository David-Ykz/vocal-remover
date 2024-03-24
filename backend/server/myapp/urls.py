# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.api_endpoint),
    path('upload/', views.api_endpoint),
]
