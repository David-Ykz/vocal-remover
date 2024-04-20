import base64

import demucs.separate # requires "pip install soundfile"
import os
from dotenv import load_dotenv
from shazamio import Shazam
from lyricsgenius import Genius
import spotube


# Create your views here.
# myapp/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

load_dotenv()

SPOTIFY_ID = os.getenv('SPOTIFY_ID')
SPOTIFY_SECRET = os.getenv('SPOTIFY_SECRET')
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

def splitAudio(fileName):
    demucs.separate.main(['--mp3', '--two-stems', 'vocals', '-n', 'mdx_extra', fileName])
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

def downloadPlaylist(playlistLink):
    downloadManager = spotube.DownloadManager(SPOTIFY_ID, SPOTIFY_SECRET, GENIUS_API_TOKEN)
    downloadManager.start_downloader(playlistLink)

def convertPlaylist():
    files = os.listdir('./Songs')
    separatedUrls = []
    for file in files:
        separatedUrls.append(splitAudio(file))

@csrf_exempt
async def handleFileUpload(request):
    audioFile = request.FILES['file']
    splitAudio(audioFile)
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
