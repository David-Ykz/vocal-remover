import React, { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

const AudioPlayer = ({ url, isPlayingAll, setIsPlayingAll }) => {
    const waveformRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [waveSurfer, setWaveSurfer] = useState(null);

    useEffect(() => {
        const wavesurfer = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: 'violet',
            progressColor: 'purple',
            responsive: true,
            normalize: true,
            height: 100,
        });
        setWaveSurfer(wavesurfer);

        // Listen for the 'finish' event
        wavesurfer.on('finish', () => {
            setIsPlaying(false);
        });

        // Listen for the 'pause' event
        wavesurfer.on('pause', () => {
            setIsPlaying(false);
        });

        return () => {
            wavesurfer.destroy();
        };
    }, []);

    useEffect(() => {
        if (waveSurfer) {
            waveSurfer.load(url);
            waveSurfer.setVolume(volume);
        }
    }, [url, waveSurfer, volume, isPlayingAll]);

    const handlePlayPause = () => {
        if (waveSurfer) {
            if (isPlaying || isPlayingAll) {
                waveSurfer.pause();
            } else {
                waveSurfer.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (waveSurfer) {
            waveSurfer.setVolume(newVolume);
        }
    };

    return (
        <div>
            <div ref={waveformRef} style={{ width: '100%', height: '100px' }} />
            <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
            />
        </div>
    );
};

export default AudioPlayer;
