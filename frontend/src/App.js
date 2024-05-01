import React, {useState} from 'react';
import AudioPlayer from "./AudioPlayer";
import UploadForm from "./UploadForm.js";
import {createAudioUrl} from "./AudioProcessor";
import axios from "axios";
import {render} from "react-dom";

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
    const [isStillProcessing, setIsStillProcessing] = useState(false);
//    const [rerenderToggle, setRerenderToggle] = useState(false);
    const [numSongs, setNumSongs] = useState(0);
    var keepPolling = false;


    function clearPlaylists() {
        playlistVocals = [];
        playlistNonVocals = [];
        playlistSongNames = []
        playlistSongLyrics = [];

    }

    function addToPlaylist(response) {
        if (response.song_number > playlistVocals.length) {
            console.log('added');
            playlistVocals.push(response.song_data.vocals);
            playlistNonVocals.push(response.song_data.no_vocals);
            playlistSongNames.push(response.song_data.names);
            playlistSongLyrics.push(response.song_data.lyrics);
            setNumSongs(playlistVocals.length);
        }
    }

//    setInterval(checkPlaylistProgress, 30000);


    async function checkPlaylistProgress() {
        console.log('in func: ' + keepPolling);
        if (keepPolling) {
            const url = 'http://localhost:8000/api/latest_song/';
            try {
                const response = await axios.get(url);
                const beforeLength = playlistVocals.length;
                addToPlaylist(response.data);
//                setRerenderToggle(!rerenderToggle);
                if (beforeLength === 0 && playlistVocals.length > 0) {
                    updateAudioPlayer(0);
                    setShowAudioPlayer(true);
                    setIsPlaylist(true);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
            setTimeout(checkPlaylistProgress, 10000);
        }
    }

    function onServerResponse(response) {
        console.log(response);
        if (response.response_type === "single") {
            response = response.song_data;
            setVocalsUrl(createAudioUrl(response.vocals));
            setNoVocalsUrl(createAudioUrl(response.no_vocals));
            setSongName(response.name);
            setSongLyrics(response.lyrics);
            setIsPlaylist(false);
            setShowAudioPlayer(true);
        } else if (response.response_type === "playlist_finished") {
            console.log('done processing');
            addToPlaylist(response);
            keepPolling = false;
    //        setRerenderToggle(!rerenderToggle);
            console.log('after setting: ' + isStillProcessing);
        } else if (response.response_type === "busy") {
            keepPolling = false;
            window.alert("The server is currently processing another song. Please try again later")
        }
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

    function displayUploadForm() {
        setShowAudioPlayer(false);
        keepPolling = false;
        setIsPlaylist(false);
        clearPlaylists();
        playlistIndex = 0;
    }

    async function startCheckingFunction() {
        keepPolling = true;
        setTimeout(checkPlaylistProgress, 10000);
    }

    return (
        <div>
            {showAudioPlayer ?
                (
                    <>
                        <AudioPlayer vocalsUrl={vocalsUrl} nonVocalsUrl={noVocalsUrl} songName={songName} songLyrics={songLyrics}/>
                        <div style={{position: 'absolute', bottom: '15%', marginLeft: '45%'}}>
                            <button onClick={displayUploadForm} style={{ backgroundColor: '#4E4096', color: 'white', border: 'none', fontSize: '16px', padding: '10px', borderRadius: '10px', fontFamily: 'Segoe UI', marginLeft: '10px'}}>Back</button>
                        </div>
                        {isPlaylist ?
                            (
                                <div>

                                    <div style={{position: 'absolute', bottom: '15%', marginLeft: '5%'}}>
                                        <button onClick={previousSong} style={{ backgroundColor: '#4E4096', color: 'white', border: 'none', fontSize: '16px', padding: '10px', borderRadius: '10px', fontFamily: 'Segoe UI'}}>Previous Song</button>
                                        <button onClick={nextSong} style={{ backgroundColor: '#4E4096', color: 'white', border: 'none', fontSize: '16px', padding: '10px', borderRadius: '10px', fontFamily: 'Segoe UI', marginLeft: '10px'}}>Next Song</button>
                                    </div>
                                    <p style={{color: 'white', fontSize: '24px', fontFamily: 'Segoe UI', marginLeft: '5%', position: 'absolute', bottom: '5%'}}>
                                        {playlistIndex + 1} / {numSongs}
                                    </p>
                                </div>
                            )
                            :
                            <></>
                        }
                    </>
                )
                :
                <UploadForm onServerResponse={onServerResponse} setIsStillProcessing={setIsStillProcessing} startCheckingFunction={startCheckingFunction} style={{display: 'flex', justifyContent: 'center', marginTop: '10%'}}/>
            }
        </div>
    );
};

export default App;
