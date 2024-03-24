from django.shortcuts import render

# Create your views here.
# myapp/views.py
from django.http import JsonResponse

def api_endpoint(request):
    # Your logic to handle the API request
    data = {'message': 'This is the API endpoint'}
    return JsonResponse(data)
