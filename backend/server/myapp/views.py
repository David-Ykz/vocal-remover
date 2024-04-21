import base64
import time

import demucs.separate # requires "pip install soundfile"
import os
from dotenv import load_dotenv
from shazamio import Shazam
from lyricsgenius import Genius
import spotube
import threading


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

def splitAudio(filePath, song):
#    demucs.separate.main(['--mp3', '--two-stems', 'vocals', '-n', 'mdx_extra', filePath])
    vocalString = readAudioToString('separated/mdx_extra/' + song + '/vocals.mp3')
    nonVocalString = readAudioToString('separated/mdx_extra/' + song + '/no_vocals.mp3')
    return vocalString, nonVocalString

async def getSongName(fileName):
    shazam = Shazam()
    song = await shazam.recognize(fileName)
    return song["track"]["share"]["subject"]

def getSongLyrics(songName):
    lyrics = ""
    try:
        genius = Genius(GENIUS_API_TOKEN)
        lyrics = genius.search_song(songName).lyrics
    except:
        print("could not find lyrics")

    return lyrics

def downloadPlaylist(playlistLink):
    downloadManager = spotube.DownloadManager(SPOTIFY_ID, SPOTIFY_SECRET, GENIUS_API_TOKEN)
    downloadManager.start_downloaderWithoutThread(playlistLink)

async def convertPlaylist():
    mainDirectory = './Songs'
    files = os.listdir(mainDirectory)
    separatedVocals = []
    separatedNonVocals = []
    songNames = []
    songLyrics = []
    for file in files:
        filePath = mainDirectory + '/' + file
        print("Processing: " + filePath)
        vocals, nonVocals = splitAudio(filePath, file[:-4])
        separatedVocals.append(vocals)
        separatedNonVocals.append(nonVocals)
        songName = await getSongName(filePath)
        songNames.append(songName)
        lyrics = getSongLyrics(songName)
        songLyrics.append(lyrics)
    return separatedVocals, separatedNonVocals, songNames, songLyrics

@csrf_exempt
async def handleFileUpload(request):
    audioFile = request.FILES['file']
    saveAudio(audioFile)
    vocals, nonVocals = splitAudio('audio.mp3')
    songName = await getSongName('audio.mp3')
    songLyrics = getSongLyrics(songName)

    response_data = {
        'response_type': 'single',
        'vocals': vocals,
        'no_vocals': nonVocals,
        'name': songName,
        'lyrics': songLyrics
    }
    return JsonResponse(response_data)

@csrf_exempt
async def handlePlaylistUpload(request):
    print(request)
    playlistLink = "https://open.spotify.com/playlist/0HIIb9KTmD5kmU61L4r1o4?si=26eb665e3110432b"
#    downloadPlaylist(playlistLink)
    vocals, nonVocals, songNames, songLyrics = await convertPlaylist()
    response_data = {
        'response_type': 'playlist',
        'vocals': vocals,
        'no_vocals': nonVocals,
        'names': songNames,
        'lyrics': songLyrics
    }
    return JsonResponse(response_data)

