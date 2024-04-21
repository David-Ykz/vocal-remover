import React, {useState} from 'react';
import axios from 'axios';

const PlaylistUploadForm = ({onServerResponse}) => {
    const uploadControlStyle = { backgroundColor: '#4E4096', color: 'white', border: 'none', fontSize: '24px', padding: '10px', borderRadius: '10px', fontFamily: 'Segoe UI'}

    const [displayUploadPrompt, setDisplayUploadPrompt] = useState(false);

    async function handleUpload(link) {
        setDisplayUploadPrompt(true);
        const url = 'http://localhost:8000/api/upload/';
        const formData = new FormData();
        formData.append('link', link);
        try {
            const response = await axios.post(url, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
            console.log(response.data);
            onServerResponse(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
        setDisplayUploadPrompt(false);
    }

    return (
        <div>
            <p style={{fontFamily: 'Segoe UI', fontSize: '48px', textAlign: 'center', color: 'white'}}>Enter Any Spotify Playlist Link To Start</p>
            <div style={{display: 'flex', justifyContent: 'center'}}>

            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <button onClick={handleUpload} style={{...uploadControlStyle, marginTop: '30px', paddingTop: '7px', cursor: 'pointer'}}>Upload</button>
            </div>
            {displayUploadPrompt ?
                <p style={{fontFamily: 'Segoe UI', fontSize: '18px', textAlign: 'center', color: 'white', marginTop: '5px'}}>
                    Processing file. This may take up to 10 minutes depending on the length of the file uploaded
                </p>
                :
                <></>
            }
        </div>
    );
};

export default PlaylistUploadForm;
