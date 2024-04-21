import React, {useState} from 'react';
import AudioPlayer from "./AudioPlayer";
import UploadForm from "./UploadForm.js";
import {createAudioUrl} from "./AudioProcessor";
import axios from "axios";

var playlistVocals = [];
var playlistNonVocals = [];
var playlistSongNames = [];
var playlistSongLyrics = [];
var playlistIndex = 0;

const App = () => {
	document.body.style.backgroundColor = '#333342';

    const [vocalsUrl, setVocalsUrl] = useState('');
    const [noVocalsUrl, setNoVocalsUrl] = useState('');
    const [songName, setSongName] = useState('');
    const [songLyrics, setSongLyrics] = useState('');
    const [showAudioPlayer, setShowAudioPlayer] = useState(false);
    const [isPlaylist, setIsPlaylist] = useState(false);


    function onServerResponse(response) {
        console.log(response);
        if (response.response_type === "single") {
            setVocalsUrl(createAudioUrl(response.vocals));
            setNoVocalsUrl(createAudioUrl(response.no_vocals));
            setSongName(response.name);
            setSongLyrics(response.lyrics);
            setIsPlaylist(false);
        } else if (response.response_type === "playlist") {
            console.log("before: " + playlistVocals);
            playlistVocals = response.vocals;
            console.log("after: " + playlistVocals);
            playlistNonVocals = response.no_vocals;
            playlistSongNames = response.names;
            playlistSongLyrics = response.lyrics;


            updateAudioPlayer(0);

            setIsPlaylist(true);
        }
        setShowAudioPlayer(true);
    }

    function nextSong() {
        const playlistLength = playlistVocals.length;
        console.log(playlistLength);
        console.log(playlistVocals);
        if (playlistIndex + 1 < playlistLength) {
            playlistIndex += 1;
            updateAudioPlayer(playlistIndex);
        }
    }

    function updateAudioPlayer(index) {
        console.log(playlistVocals)
        setVocalsUrl(createAudioUrl(playlistVocals[index]));
        setNoVocalsUrl(createAudioUrl(playlistNonVocals[index]));
        setSongName(playlistSongNames[index]);
        setSongLyrics(playlistSongLyrics[index]);
    }


    return (
        <div>
            {showAudioPlayer ?
                <AudioPlayer vocalsUrl={vocalsUrl} nonVocalsUrl={noVocalsUrl} songName={songName} songLyrics={songLyrics}/>
                :
                <UploadForm onServerResponse={onServerResponse} style={{display: 'flex', justifyContent: 'center', marginTop: '10%'}}/>
            }

            {isPlaylist ?
                (
                    <div>

                        <button onClick={nextSong}>Next</button>
                        {playlistVocals.length}
                    </div>
                )
                :
                <></>
            }
        </div>
    );
};

export default App;
