import React, {useEffect, useState} from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import playIcon from './play.png';
import pauseIcon from './pause.png';
import resetIcon from './reset.png';
import volumeIcon from './volume.png';

const AudioVisualizer = ({name, url, isPlayingAll, setIsPlayingAll }) => {
    const [waveSurfer, setWaveSurfer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);

    const wsBackgroundColor = name === 'Vocals' ? '#159160' : '#38347e';
    const wsWaveColor = name === 'Vocals' ? '#95ffd2' : '#9088e1';
    const wsProgressColor = name === 'Vocals' ? '#1cffaa' : '#655cc4';

    const iconSize = '25px';
    const buttonStyle = {backgroundColor: 'transparent', outline: 'none', border: 'none'};

    useEffect(() => {
        if (waveSurfer) {
            if (isPlayingAll) {
                waveSurfer.play();
            } else {
                waveSurfer.pause();
            }
        }
        setIsPlaying(isPlayingAll);
    }, [isPlayingAll]);

    function onReady(ws) {
        setWaveSurfer(ws);
        setIsPlaying(false);
    }

    function onPlayPause() {
        isPlaying ? waveSurfer.pause() : waveSurfer.play();
    }

    function onVolumeChange(e) {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        waveSurfer.setVolume(newVolume);
    }

    function onFinish() {
        setIsPlayingAll(false);
        setIsPlaying(false);
    }

    function resetTrackPosition() {
        waveSurfer.seekTo(0);
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center'}}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '20px'}}>
                <p style={{fontFamily: 'Segoe UI', fontSize: '24px', textAlign: 'center', color: 'white'}}>
                    {name}
                </p>
                <img src={volumeIcon} alt={'volume'} height={iconSize}/>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={onVolumeChange}
                    style={{
                        appearance: 'none',
                        width: '50px',
                        height: '6px',
                        background: 'white',
                        borderRadius: '5px',
                        outline: 'none'
                    }}
                />
                <button onClick={onPlayPause} style={buttonStyle}>{isPlaying ?
                    <img src={pauseIcon} alt='pause' height={iconSize}/>
                    :
                    <img src={playIcon} alt='play' height={iconSize}/>
                }</button>
                <button onClick={resetTrackPosition} style={buttonStyle}>
                    <img src={resetIcon} alt='reset' height={iconSize}/>
                </button>
            </div>
            <div style={{backgroundColor: wsBackgroundColor}}>
                <WavesurferPlayer
                    height={100}
                    width={400}
                    waveColor={wsWaveColor}
                    progressColor={wsProgressColor}
                    url={url}
                    onReady={onReady}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onFinish={onFinish}
                />
            </div>
        </div>
    );
};

export default AudioVisualizer;
