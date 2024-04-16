import demucs.separate
# requires "pip install soundfile"
from shazamio import Shazam
import asyncio
#demucs.separate.main(["--mp3", "--two-stems", "vocals", "-n", "mdx_extra", "audio1.mp3"])

from lyricsgenius import Genius


API_KEY = ''

genius = Genius(API_KEY)

print(genius.search_song('Viva La Vida - Coldplay').lyrics)



async def recognizeSong(fileName):
    shazam = Shazam()
    out = await shazam.recognize(fileName)
    return out

def getSongInfo(fileName):
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(recognizeSong(fileName))["track"]["share"]["subject"]

#data = getSongInfo('audio1.mp3')

#print(data["track"]["share"]["subject"])
#print(data)
# Initialize with default parameters:
#separator = demucs.api.Separator()

# Use another model and segment:
#separator = demucs.api.Separator(model="mdx_extra", segment=12)

# Separating an audio file
#origin, separated = separator.separate_audio_file("audio1.mp3")

# Remember to create the destination folder before calling `save_audio`
# Or you are likely to recieve `FileNotFoundError`
#for file, sources in separated:
 #   for stem, source in sources.items():
  #      demucs.api.save_audio(source, f"{stem}_{file}", samplerate=separator.samplerate)



print("Hello World")