import React, {useState} from 'react';
import axios from 'axios';

const UploadForm = ({onServerResponse}) => {
    const uploadControlStyle = { backgroundColor: '#4E4096', color: 'white', border: 'none', fontSize: '24px', padding: '10px', borderRadius: '10px', fontFamily: 'Segoe UI'}

    const [file, setFile] = useState(null);

    function handleFileChange(e) {
        setFile(e.target.files[0]);
    }

    async function handleUpload() {
        const url = 'http://localhost:8000/api/upload/';
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post(url, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
            console.log(response.data);
            onServerResponse(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    return (
        <div>
            <p style={{fontFamily: 'Segoe UI', fontSize: '48px', textAlign: 'center', color: 'white'}}>Upload Any Mp3 File To Start</p>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <label htmlFor="fileInput" style={{...uploadControlStyle, position: 'relative', overflow: 'hidden'}}>Choose File
                    <input id="fileInput" type="file" onChange={handleFileChange} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                </label>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <button onClick={handleUpload} style={{...uploadControlStyle, marginTop: '50px', paddingTop: '7px', cursor: 'pointer'}}>Upload</button>
            </div>
        </div>
    );
};

export default UploadForm;
