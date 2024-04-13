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
    const topPosition = name === 'Vocals' ? '0px' : '150px';
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
        <div style={{ position: 'absolute', top: topPosition}}>
            <p style={{fontFamily: 'Segoe UI', fontSize: '24px', color: 'white', position: 'absolute', top: '-5px', left: '5px'}}>
                {name}
            </p>
            <img src={volumeIcon} alt={'volume'} height={'25px'} style={{position: 'absolute', left: '63px', top: '58px'}}/>
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
                    outline: 'none',
                    position: 'absolute',
                    top: '65px',
                    left: '90px'
                }}
            />
            <button onClick={onPlayPause} style={{...buttonStyle, position: 'absolute', left: '0px', top: '60px'}}>{isPlaying ?
                <img src={pauseIcon} alt='pause' height={'20px'}/>
                :
                <img src={playIcon} alt='play' height={'20px'}/>
            }</button>
            <button onClick={resetTrackPosition} style={{...buttonStyle, position: 'absolute', left: '25px', top: '58px'}}>
                <img src={resetIcon} alt='reset' height={'25px'}/>
            </button>
            <div style={{backgroundColor: wsBackgroundColor, position: 'absolute', left: '170px'}}>
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
