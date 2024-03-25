from django.shortcuts import render

# Create your views here.
# myapp/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def testConnection(request):
    return JsonResponse({'message': 'Test'})

@csrf_exempt
def handleFile(request):
    print('handle')
    print(request.POST)
    return JsonResponse({'message': 'Recieved'})

def api_endpoint(request):
    # Your logic to handle the API request
    data = {'message': 'This is the API endpoint'}
    return JsonResponse(data)
