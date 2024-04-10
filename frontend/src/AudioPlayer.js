import React, { useState } from 'react';
import AudioVisualizer from "./AudioVisualizer";

const AudioPlayer = ({ vocalsUrl, nonVocalsUrl}) => {
    const [isPlayingAll, setIsPlayingAll] = useState(false);

    function changePlaying() {
        setIsPlayingAll(!isPlayingAll);
    }



    return (
        <div>
            <button onClick={changePlaying}>
                {isPlayingAll ? 'Pause All' : 'Play All'}
            </button>
            <AudioVisualizer url={vocalsUrl} isPlayingAll={isPlayingAll} setIsPlayingAll={setIsPlayingAll}></AudioVisualizer>
            <AudioVisualizer url={nonVocalsUrl} isPlayingAll={isPlayingAll} setIsPlayingAll={setIsPlayingAll}></AudioVisualizer>
        </div>
    );
};

export default AudioPlayer;
