# Create your views here.
# myapp/views.py
import threading
from contextlib import contextmanager
from threading import Thread
import base64
import time
import os
import asyncio
from dotenv import load_dotenv
from celery import shared_task

import demucs.separate # requires "pip install soundfile"
from shazamio import Shazam
from lyricsgenius import Genius
import spotube

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

load_dotenv()
SPOTIFY_ID = os.getenv('SPOTIFY_ID')
SPOTIFY_SECRET = os.getenv('SPOTIFY_SECRET')
GENIUS_API_TOKEN = os.getenv('GENIUS_API_TOKEN')
DEMUCS_MODEL_NAME = 'mdx_extra'
PLAYLIST_DOWNLOAD_DIRECTORY = './Songs/'

convertedSongs = []
isFinishedConverting = True

class PlaylistResponse(JsonResponse):
    def close(self):
        super(PlaylistResponse, self).close()
        print('printed after')
        thread = threading.Thread(target=convertPlaylist, args=())
        thread.start()
        thread.join()
#        asyncio.create_task(convertPlaylist())


def saveAudio(file):
    with open('audio.mp3', 'wb') as destination:
        for chunk in file.chunks():
            destination.write(chunk)

def splitAudio(path):
    def saveFileSize():
        try:
            with open('saved_file_sizes', 'r') as file:
                originalSize = int(file.read().strip())
        except:
            originalSize = 0
        size = os.path.getsize(path)
        bSize = originalSize + size
        kbSize = int(bSize/1024)
        mbSize = int(kbSize/1024)
        gbSize = int(mbSize/1024)
        print(f"b: {bSize} | kb: {kbSize} | mb: {mbSize} | gb: {gbSize}")
        with open('saved_file_sizes', 'w') as output_file:
            output_file.write(str(originalSize + size))

    saveFileSize()

    start = time.time()
    demucs.separate.main(['--mp3', '--two-stems', 'vocals', '-n', 'mdx_extra', '--overlap', '0.1', path])
    end = time.time()
    print("time taken to split audio: " + str(end - start))

def readSeparatedAudio():
    path = 'separated/' + DEMUCS_MODEL_NAME
    songPath = path + '/' + os.listdir(path)[0]

    def readAudioToString(audio):
        with open(songPath + audio, 'rb') as file:
            data = file.read()
        return base64.b64encode(data).decode('utf-8')

    vocalString = readAudioToString('/vocals.mp3')
    nonVocalString = readAudioToString('/no_vocals.mp3')
    os.remove(songPath + '/vocals.mp3')
    os.remove(songPath + '/no_vocals.mp3')
    os.rmdir(songPath)

    return vocalString, nonVocalString

async def getSongInfo(path):
    async def getSongName():
        shazam = Shazam()
        try:
            song = await shazam.recognize(path)
            return song["track"]["share"]["subject"]
        except:
            return ""

    songName = await getSongName()

    def getSongLyrics():
        genius = Genius(GENIUS_API_TOKEN)
        for i in range(3):
            try:
                return genius.search_song(songName).lyrics
            except:
                print('error getting song name')
        return "Could not get lyrics"

    songLyrics = getSongLyrics()

    return songName, songLyrics

async def convertSong(song):
    splitAudio(song)
    vocals, nonVocals = readSeparatedAudio()
    songName, songLyrics = await getSongInfo(song)
    os.remove(song)

    return {
        'vocals': vocals,
        'no_vocals': nonVocals,
        'name': songName,
        'lyrics': songLyrics
    }

def downloadPlaylist(playlistLink):
    downloadManager = spotube.DownloadManager(SPOTIFY_ID, SPOTIFY_SECRET, GENIUS_API_TOKEN)
    downloadManager.start_downloaderWithoutThread(playlistLink)

async def convertPlaylist():
    global isFinishedConverting
    isFinishedConverting = False
    for path in os.listdir(PLAYLIST_DOWNLOAD_DIRECTORY):
        convertedSongs.append(await convertSong(PLAYLIST_DOWNLOAD_DIRECTORY + path))
    isFinishedConverting = True

def getLatestSong():
    global convertedSongs
    numSongsConverted = len(convertedSongs)

    latestSong = convertedSongs[numSongsConverted - 1]
    if isFinishedConverting:
        convertedSongs = []
    return numSongsConverted, latestSong

@csrf_exempt
async def handleFileUpload(request):
    audioFile = request.FILES['file']
    saveAudio(audioFile)

    response_data = {
        'response_type': 'single',
        'song_data': await convertSong('audio.mp3')
    }
    return JsonResponse(response_data)

@csrf_exempt
async def handlePlaylistUpload(request):
    playlistLink = request.POST['link']
    downloadPlaylist(playlistLink)
    await convertPlaylist()

    numSongs, latestSong = getLatestSong()
    response_data = {
        'response_type': 'playlist_finished',
        'song_number': numSongs,
        'song_data': latestSong
    }
    return JsonResponse(response_data)

@csrf_exempt
async def handlePlaylistCheck(request):
    if len(convertedSongs) == 0:
        response_data = {
            'response_type': 'playlist',
            'song_number': 0
        }
        return JsonResponse(response_data)
    numSongs, latestSong = getLatestSong()
    response_data = {
        'response_type': 'playlist',
        'song_number': numSongs,
        'song_data': latestSong
    }
    return JsonResponse(response_data)



# @csrf_exempt
# async def exampleSingleFile(request):
#     path = 'Example/Paradise/'
#     songName = await getSongName(path + 'audio.mp3')
#     songLyrics = getSongLyrics(songName)
#
#     response_data = {
#         'response_type': 'single',
#         'vocals': readAudioToString(path + 'vocals.mp3'),
#         'no_vocals': readAudioToString(path + 'no_vocals.mp3'),
#         'name': songName,
#         'lyrics': songLyrics
#     }
#     return JsonResponse(response_data)
#
# @csrf_exempt
# async def examplePlaylist(request):
#     vocals, nonVocals, songNames, songLyrics = await convertExamplePlaylist()
#     response_data = {
#         'response_type': 'playlist',
#         'vocals': vocals,
#         'no_vocals': nonVocals,
#         'names': songNames,
#         'lyrics': songLyrics
#     }
#     return JsonResponse(response_data)

