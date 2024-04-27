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
    DEMUCS_MODEL_NAME = 'htdemucs'
    DEMUCS_MODEL_NAME = 'mdx_extra'
    start = time.time()
#    demucs.separate.main(['--mp3', '--two-stems', 'vocals', filePath])
    demucs.separate.main(['--mp3', '--two-stems', 'vocals', '-n', 'mdx_extra', '--overlap', '0.1', filePath])
    end = time.time()
    print("time taken to split audio: " + str(end - start))
    vocalString = readAudioToString('separated/' + DEMUCS_MODEL_NAME + '/' + song + '/vocals.mp3')
    nonVocalString = readAudioToString('separated/' + DEMUCS_MODEL_NAME + '/' + song + '/no_vocals.mp3')

#    os.remove('separated/' + DEMUCS_MODEL_NAME + '/' + song + '/vocals.mp3')
 #   os.remove('separated/' + DEMUCS_MODEL_NAME + '/' + song + '/no_vocals.mp3')
  #  os.rmdir('separated/' + DEMUCS_MODEL_NAME + '/' + song)

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
        os.remove(filePath)
        songNames.append(songName)
        lyrics = getSongLyrics(songName)
        songLyrics.append(lyrics)
    return separatedVocals, separatedNonVocals, songNames, songLyrics

async def convertExamplePlaylist():
    files = os.listdir('./Example')
    separatedVocals = []
    separatedNonVocals = []
    songNames = []
    songLyrics = []
    for file in files:
        filePath = './Example/' + file
        separatedVocals.append(readAudioToString(filePath + '/vocals.mp3'))
        separatedNonVocals.append(readAudioToString(filePath + '/no_vocals.mp3'))
        songName = await getSongName(filePath + '/audio.mp3')
        songNames.append(songName)
        lyrics = getSongLyrics(songName)
        songLyrics.append(lyrics)
    return separatedVocals, separatedNonVocals, songNames, songLyrics


@csrf_exempt
async def handleFileUpload(request):
    audioFile = request.FILES['file']
    saveAudio(audioFile)
    vocals, nonVocals = splitAudio('audio.mp3', 'audio')
    songName = await getSongName('audio.mp3')
#    os.remove('audio.mp3')
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
    playlistLink = request.POST['link']
    print(playlistLink)
    downloadPlaylist(playlistLink)
    vocals, nonVocals, songNames, songLyrics = await convertPlaylist()
    response_data = {
        'response_type': 'playlist',
        'vocals': vocals,
        'no_vocals': nonVocals,
        'names': songNames,
        'lyrics': songLyrics
    }
    return JsonResponse(response_data)


@csrf_exempt
async def exampleSingleFile(request):
    path = 'Example/example1/'
    songName = await getSongName(path + 'audio.mp3')
    songLyrics = getSongLyrics(songName)

    response_data = {
        'response_type': 'single',
        'vocals': readAudioToString(path + 'vocals.mp3'),
        'no_vocals': readAudioToString(path + 'no_vocals.mp3'),
        'name': songName,
        'lyrics': songLyrics
    }
    return JsonResponse(response_data)

@csrf_exempt
async def examplePlaylist(request):
    vocals, nonVocals, songNames, songLyrics = await convertExamplePlaylist()
    response_data = {
        'response_type': 'playlist',
        'vocals': vocals,
        'no_vocals': nonVocals,
        'names': songNames,
        'lyrics': songLyrics
    }
    return JsonResponse(response_data)


# 428 84 101 276 18