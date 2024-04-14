import base64

from django.shortcuts import render
import demucs.separate # requires "pip install soundfile"
import os
import requests


# Create your views here.
# myapp/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def readAudioToString(path):
    if os.path.exists(path):
        with open(path, 'rb') as file:
            data = file.read()
        return base64.b64encode(data).decode('utf-8')
    else:
        print("Error: could not locate file at path: " + path)
        return ""

def saveAudio(file):
    with open('audio.mp3', 'wb') as destination:
        for chunk in file.chunks():
            destination.write(chunk)

def splitAudio(file):
    saveAudio(file)
    demucs.separate.main(['--mp3', '--two-stems', 'vocals', '-n', 'mdx_extra', 'audio.mp3'])
    vocalString = readAudioToString('separated/mdx_extra/audio/vocals.mp3')
    nonVocalString = readAudioToString('separated/mdx_extra/audio/no_vocals.mp3')
    return vocalString, nonVocalString

@csrf_exempt
def handleFileUpload(request):
    audioFile = request.FILES['file']
    vocals, nonVocals = splitAudio(audioFile)

    response_data = {
        'vocals': vocals,
        'no_vocals': nonVocals
    }
    return JsonResponse(response_data)
