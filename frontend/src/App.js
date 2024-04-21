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
            playlistVocals = response.vocals;
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
        if (playlistIndex + 1 < playlistLength) {
            playlistIndex += 1;
            updateAudioPlayer(playlistIndex);
        }
    }

    function previousSong() {
        if (playlistIndex - 1 >= 0) {
            playlistIndex -= 1;
            updateAudioPlayer(playlistIndex);
        }
    }

    function updateAudioPlayer(index) {
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
                    <div style={{position: 'absolute', bottom: '10%', marginLeft: '5%'}}>
                        <button onClick={previousSong} style={{ backgroundColor: '#4E4096', color: 'white', border: 'none', fontSize: '16px', padding: '10px', borderRadius: '10px', fontFamily: 'Segoe UI'}}>Previous Song</button>
                        <button onClick={nextSong} style={{ backgroundColor: '#4E4096', color: 'white', border: 'none', fontSize: '16px', padding: '10px', borderRadius: '10px', fontFamily: 'Segoe UI', marginLeft: '10px'}}>Next Song</button>
                    </div>
                )
                :
                <></>
            }
        </div>
    );
};

export default App;
