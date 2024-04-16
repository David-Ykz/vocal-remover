import base64

import demucs.separate # requires "pip install soundfile"
import os
from dotenv import load_dotenv
import asyncio
from shazamio import Shazam
from lyricsgenius import Genius

# Create your views here.
# myapp/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

load_dotenv()
GENIUS_API_TOKEN = os.getenv('GENIUS_API_TOKEN')

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

async def getSongName(fileName):
    shazam = Shazam()
    song = await shazam.recognize(fileName)
    return song["track"]["share"]["subject"]

def getSongLyrics(songName):
    genius = Genius(GENIUS_API_TOKEN)
    return genius.search_song(songName).lyrics


@csrf_exempt
async def handleFileUpload(request):
    audioFile = request.FILES['file']
    vocals, nonVocals = splitAudio(audioFile)
    songName = await getSongName('audio.mp3')
    songLyrics = getSongLyrics(songName)

    response_data = {
        'vocals': vocals,
        'no_vocals': nonVocals,
        'name': songName,
        'lyrics': songLyrics
    }
    return JsonResponse(response_data)
