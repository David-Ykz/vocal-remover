import React, {useEffect, useState} from 'react';
import WavesurferPlayer from '@wavesurfer/react';

const AudioVisualizer = ({ url, isPlayingAll, setIsPlayingAll }) => {
    const [waveSurfer, setWaveSurfer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        if (isPlayingAll) {
            waveSurfer.play();
        } else {
            waveSurfer.pause();
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

    return (
        <div>
            <WavesurferPlayer
                height={100}
                waveColor={'#ff892f'}
                progressColor={'#e5431a'}
                url={url}
                onReady={onReady}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onFinish={onFinish}
            />

            <button onClick={onPlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={onVolumeChange}
            />
        </div>
    );
};

export default AudioVisualizer;
