# Create your views here.
# myapp/views.py
import threading
import base64
import time
import os
from dotenv import load_dotenv

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
EXAMPLE_PATH = './Example/Paradise/'
EXAMPLE_PLAYLIST_PATH = './Example/'

convertedSongs = []
isFinishedConverting = True

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

def readSeparatedAudio(path, delete):
    def readAudioToString(audio):
        with open(path + audio, 'rb') as file:
            data = file.read()
        return base64.b64encode(data).decode('utf-8')

    vocalString = readAudioToString('/vocals.mp3')
    nonVocalString = readAudioToString('/no_vocals.mp3')
    if delete:
        os.remove(path + '/vocals.mp3')
        os.remove(path + '/no_vocals.mp3')
        os.rmdir(path)

    return vocalString, nonVocalString

async def getSongInfo(path):
    print(path)
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
    path = 'separated/' + DEMUCS_MODEL_NAME
    songPath = path + '/' + os.listdir(path)[0]
    vocals, nonVocals = readSeparatedAudio(songPath, True)
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

async def getExampleSong(songPath, song):
    vocals, nonVocals = readSeparatedAudio(songPath, False)
    songName, songLyrics = await getSongInfo(songPath + song)

    return {
        'vocals': vocals,
        'no_vocals': nonVocals,
        'name': songName,
        'lyrics': songLyrics
    }

async def convertExamplePlaylist():
    global isFinishedConverting
    isFinishedConverting = False
    for path in os.listdir(EXAMPLE_PLAYLIST_PATH):
        convertedSongs.append(await getExampleSong(EXAMPLE_PLAYLIST_PATH + path + '/', 'audio.mp3'))
        time.sleep(10)
    isFinishedConverting = True

@csrf_exempt
async def handleFileUpload(request):
    global isFinishedConverting
    if not isFinishedConverting:
        response_data = {
            'response_type': 'busy',
        }
        return JsonResponse(response_data)

    isFinishedConverting = False
    audioFile = request.FILES['file']
    saveAudio(audioFile)

    response_data = {
        'response_type': 'single',
        'song_data': await convertSong('audio.mp3')
    }

    isFinishedConverting = True

    return JsonResponse(response_data)

@csrf_exempt
async def handlePlaylistUpload(request):
    global isFinishedConverting
    if not isFinishedConverting:
        response_data = {
            'response_type': 'busy',
        }
        return JsonResponse(response_data)

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


@csrf_exempt
async def handleExampleFile(request):
    global isFinishedConverting
    if not isFinishedConverting:
        response_data = {
            'response_type': 'busy',
        }
        return JsonResponse(response_data)

    response_data = {
        'response_type': 'single',
        'song_data': await getExampleSong(EXAMPLE_PATH, 'audio.mp3')
    }
    return JsonResponse(response_data)

@csrf_exempt
async def handleExamplePlaylist(request):
    global isFinishedConverting
    if not isFinishedConverting:
        response_data = {
            'response_type': 'busy',
        }
        return JsonResponse(response_data)

    await convertExamplePlaylist()

    numSongs, latestSong = getLatestSong()
    response_data = {
        'response_type': 'playlist_finished',
        'song_number': numSongs,
        'song_data': latestSong
    }
    return JsonResponse(response_data)
