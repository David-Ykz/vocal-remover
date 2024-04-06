from django.shortcuts import render
import demucs.separate # requires "pip install soundfile"
import os

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
    print(request.POST.keys)
    print(request.POST['file'])
    print(type(request.POST['file']))
    return JsonResponse({'message': 'Recieved'})


@csrf_exempt
def oldhandleFileUpload(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        if uploaded_file.content_type != 'audio/mpeg':
            return JsonResponse({'error': 'Invalid file format'}, status=400)

        with open('uploadedFile.mp3', 'wb') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        demucs.separate.main(["--mp3", "--two-stems", "vocals", "-n", "mdx_extra", "uploadedFile.mp3"])

        return JsonResponse({'message': 'File uploaded and saved successfully'})
    else:
        return JsonResponse({'error': 'File upload failed'}, status=400)
@csrf_exempt
def handleFileUpload(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        if uploaded_file.content_type != 'audio/mpeg':
            return JsonResponse({'error': 'Invalid file format'}, status=400)

        with open('audio.mp3', 'wb') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        demucs.separate.main(['--mp3', '--two-stems', 'vocals', '-n', 'mdx_extra', 'audio.mp3'])
        vocals_file_path = 'separated/mdx_extra/audio/vocals.mp3'
        no_vocals_file_path = 'separated/mdx_extra/audio/no_vocals.mp3'

        if os.path.exists(vocals_file_path) and os.path.exists(no_vocals_file_path):
            with open(vocals_file_path, 'rb') as vocals_file, open(no_vocals_file_path, 'rb') as no_vocals_file:
                vocals_data = vocals_file.read()
                no_vocals_data = no_vocals_file.read()

                response_data = {
                    'vocals': str(vocals_data),
                    'no_vocals': str(no_vocals_data)
                }

                return JsonResponse(response_data)
        else:
            return JsonResponse({'error': 'Separated audio files not found'}, status=404)

    else:
        return JsonResponse({'error': 'File upload failed'}, status=400)


def api_endpoint(request):
    # Your logic to handle the API request
    data = {'message': 'This is the API endpoint'}
    return JsonResponse(data)
