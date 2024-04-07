import React, {useEffect} from "react";
import WaveSurfer from "wavesurfer.js";


const AudioPlayer = ({ audioUrl }) => {
    useEffect(() => {
        const waveSurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'violet',
            progressColor: 'purple'
        });

        waveSurfer.load(audioUrl);

        return () => {
            waveSurfer.destroy();
        };
    }, [audioUrl]);

    return (
        <div id="waveform" style={{ width: '100%', height: '200px' }}></div>
    );
};

export default AudioPlayer;