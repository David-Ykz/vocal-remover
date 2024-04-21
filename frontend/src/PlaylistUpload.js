import React, {useState} from 'react';
import AudioPlayer from "./AudioPlayer";
import PlaylistUploadForm from "./PlaylistUploadForm";
import axios from "axios";

const PlaylistUpload = () => {
    const [vocalsUrl, setVocalsUrl] = useState('');
    const [noVocalsUrl, setNoVocalsUrl] = useState('');
    const [songName, setSongName] = useState('');
    const [songLyrics, setSongLyrics] = useState('');
    const [showAudioPlayer, setShowAudioPlayer] = useState(false);

    function base64ToBlob(base64String, mimeType) {
        const binaryString = atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return new Blob([bytes], { type: mimeType });
    }

    const createAudioUrl = (audioData, setAudioUrl) => {
        console.log("creating audio" + audioData.length);
        try {
            const blob = base64ToBlob(audioData, 'audio/mp3');
            console.log(blob);
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
        } catch (error) {
            console.error('Error creating audio URL:', error);
        }
    };

    function onServerResponse(response) {
        console.log(response);
        createAudioUrl(response.vocals, setVocalsUrl);
        createAudioUrl(response.no_vocals, setNoVocalsUrl);
        setSongName(response.name);
        setSongLyrics(response.lyrics);
        setShowAudioPlayer(true);
    }

    async function testPlaylistUpload() {
        const url = 'http://localhost:8000/api/playlist/';
        try {
            const response = await axios.get(url);
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    return (
        <div>
            {showAudioPlayer ?
                <AudioPlayer vocalsUrl={vocalsUrl} nonVocalsUrl={noVocalsUrl} songName={songName} songLyrics={songLyrics}/>
                :
                <PlaylistUploadForm onServerResponse={onServerResponse} style={{display: 'flex', justifyContent: 'center', marginTop: '10%'}}/>
            }
        </div>
    );
};

export default PlaylistUpload;
