import demucs.separate
# requires "pip install soundfile"

demucs.separate.main(["--mp3", "--two-stems", "vocals", "-n", "mdx_extra", "audio1.mp3"])


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