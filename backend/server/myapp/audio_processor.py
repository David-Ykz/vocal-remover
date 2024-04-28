import base64
import time
import os
from dotenv import load_dotenv

import demucs.separate # requires "pip install soundfile"
from shazamio import Shazam
from lyricsgenius import Genius
import spotube

load_dotenv()
SPOTIFY_ID = os.getenv('SPOTIFY_ID')
SPOTIFY_SECRET = os.getenv('SPOTIFY_SECRET')
GENIUS_API_TOKEN = os.getenv('GENIUS_API_TOKEN')
DEMUCS_MODEL_NAME = 'mdx_extra'
PLAYLIST_DOWNLOAD_DIRECTORY = './Songs'

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
        print("total bytes processed: " + str(originalSize + size))
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
    os.rmdir(path)
    return vocalString, nonVocalString

async def getSongInfo(path):
    async def getSongName():
        shazam = Shazam()
        song = await shazam.recognize(path)
        os.remove('audio.mp3')
        return song["track"]["share"]["subject"]

    songName = await getSongName()

    def getSongLyrics():
        genius = Genius(GENIUS_API_TOKEN)
        for i in range(3):
            try:
                return genius.search_song(songName).lyrics
            except:
                print('error getting song name')
        return "Could not get lyrics"

    return songName, getSongLyrics()

async def convertSong(song):
    splitAudio(song)
    vocals, nonVocals = readSeparatedAudio()
    songName, songLyrics = getSongInfo(song)

    return {
        'vocals': vocals,
        'no_vocals': nonVocals,
        'name': songName,
        'lyrics': songLyrics
    }

def downloadPlaylist(playlistLink):
    downloadManager = spotube.DownloadManager(SPOTIFY_ID, SPOTIFY_SECRET, GENIUS_API_TOKEN)
    downloadManager.start_downloaderWithoutThread(playlistLink)

def convertPlaylist(playlistLink):
    global isFinishedConverting
    isFinishedConverting = False
    downloadPlaylist(playlistLink)
    for path in os.listdir(PLAYLIST_DOWNLOAD_DIRECTORY):
        convertedSongs.append(convertSong(PLAYLIST_DOWNLOAD_DIRECTORY + path))
    isFinishedConverting = True

def getLatestSong():
    global convertedSongs
    numSongsConverted = len(convertedSongs)
    latestSong = convertedSongs[numSongsConverted - 1]
    if isFinishedConverting:
        convertedSongs = []
    return numSongsConverted, latestSong

# async def convertExamplePlaylist():
#     files = os.listdir('./Example')
#     separatedVocals = []
#     separatedNonVocals = []
#     songNames = []
#     songLyrics = []
#     for file in files:
#         filePath = './Example/' + file
#         separatedVocals.append(readAudioToString(filePath + '/vocals.mp3'))
#         separatedNonVocals.append(readAudioToString(filePath + '/no_vocals.mp3'))
#         songName = await getSongName(filePath + '/audio.mp3')
#         songNames.append(songName)
#         lyrics = getSongLyrics(songName)
#         songLyrics.append(lyrics)
#     return separatedVocals, separatedNonVocals, songNames, songLyrics
#
