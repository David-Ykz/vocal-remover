import React, { useState } from 'react';
import AudioVisualizer from "./AudioVisualizer";

const AudioPlayer = ({ vocalsUrl, nonVocalsUrl}) => {
    const [isPlayingAll, setIsPlayingAll] = useState(false);

    const buttonStyle = { backgroundColor: '#4E4096', color: 'white', border: 'none', fontSize: '20px', padding: '10px', borderRadius: '10px', fontFamily: 'Segoe UI', position: 'absolute', top: '300px', width: '100px'}

    function changePlaying() {
        setIsPlayingAll(!isPlayingAll);
    }

    return (
            <div style={{position: 'absolute', marginTop: '5%', marginLeft: '5%'}}>
                <AudioVisualizer name={'Vocals'} url={vocalsUrl} isPlayingAll={isPlayingAll} setIsPlayingAll={setIsPlayingAll} style={{position: 'absolute', top: '100px'}}></AudioVisualizer>
                <AudioVisualizer name={'Instrumental'} url={nonVocalsUrl} isPlayingAll={isPlayingAll} setIsPlayingAll={setIsPlayingAll} style={{marginTop: '50px'}}></AudioVisualizer>
                <button onClick={changePlaying} style={{...buttonStyle, }}>
                    {isPlayingAll ? 'Pause All' : 'Play All'}
                </button>
            </div>
    );
};

export default AudioPlayer;
