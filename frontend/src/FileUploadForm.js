import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AudioPlayer from "./AudioPlayer";

const FileUploadForm = ({ onFileUpload }) => {
    const serverUrl = 'http://localhost:8000/api/';
    const testUrl = serverUrl + 'test/';
    const uploadUrl = serverUrl + 'upload/';

    const [file, setFile] = useState(null);

    const [vocalsUrl, setVocalsUrl] = useState('');
    const [noVocalsUrl, setNoVocalsUrl] = useState('');
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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(uploadUrl, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
            console.log(response.data);
            createAudioUrl(response.data.vocals, setVocalsUrl);
            createAudioUrl(response.data.no_vocals, setNoVocalsUrl);
            setShowAudioPlayer(true);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            
            {showAudioPlayer && (
                <div>
                    <AudioPlayer vocalsUrl={vocalsUrl} nonVocalsUrl={noVocalsUrl}/>
                </div>
            )}
            <button onClick={() => { /* Logic to download adjusted audio files */ }}>
                Download
            </button>

        </div>
    );
};

export default FileUploadForm;
