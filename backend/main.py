import spotube
import os
from dotenv import load_dotenv
import demucs.separate # requires "pip install soundfile"
import demucs


demucs.separate.main(['--two-stems', 'vocals', '-n', 'mdx_extra', 'audio1.mp3'])
