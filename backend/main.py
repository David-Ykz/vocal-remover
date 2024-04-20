import spotube
import os
from dotenv import load_dotenv

load_dotenv()
SPOTIFY_ID=""
SPOTIFY_SECRET=""
GENIUS_TOKEN=""
downloadManager = spotube.DownloadManager(SPOTIFY_ID, SPOTIFY_SECRET, GENIUS_TOKEN)

downloadManager.start_downloader("https://open.spotify.com/playlist/0HIIb9KTmD5kmU61L4r1o4?si=26eb665e3110432b")
