import React, { useState } from 'react';
import AudioVisualizer from "./AudioVisualizer";
import LyricsVisualizer from "./LyricsVisualizer";

const AudioPlayer = ({ vocalsUrl, nonVocalsUrl, songName, songLyrics}) => {
    const [isPlayingAll, setIsPlayingAll] = useState(false);

    const buttonStyle = { backgroundColor: '#4E4096', color: 'white', border: 'none', fontSize: '20px', padding: '10px', borderRadius: '10px', fontFamily: 'Segoe UI', position: 'absolute', top: '300px', width: '100px'}

    function changePlaying() {
        setIsPlayingAll(!isPlayingAll);
    }

    return (
        <div>
            <div style={{position: 'absolute', marginTop: '5%', marginLeft: '5%'}}>
                <AudioVisualizer name={'Vocals'} url={vocalsUrl} isPlayingAll={isPlayingAll} setIsPlayingAll={setIsPlayingAll} style={{position: 'absolute', top: '100px'}}/>
                <AudioVisualizer name={'Instrumental'} url={nonVocalsUrl} isPlayingAll={isPlayingAll} setIsPlayingAll={setIsPlayingAll} style={{marginTop: '50px'}}/>
                <button onClick={changePlaying} style={{...buttonStyle, }}>
                    {isPlayingAll ? 'Pause All' : 'Play All'}
                </button>
            </div>
            <div style={{position: 'absolute', marginTop: '5%', marginLeft: '60%', backgroundColor: '#6753c9', width: '32%', height: '80%', overflowY: 'auto'}}>
                <p style={{fontFamily: 'Segoe UI', fontSize: '24px', color: 'white', marginLeft: '10px', marginTop: '10px'}}>{songName}</p>
                <LyricsVisualizer lyrics={songLyrics}/>
            </div>
        </div>
    );
};

export default AudioPlayer;
