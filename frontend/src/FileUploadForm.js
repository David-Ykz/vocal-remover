import React, { useState } from 'react';
import axios from 'axios';

const FileUploadForm = ({ onFileUpload }) => {
    const serverUrl = 'http://localhost:8000/api/';
    const testUrl = serverUrl + 'test/';
    const uploadUrl = serverUrl + 'upload/';

    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const testConn = async () => {
        axios.post(testUrl, 'abc').then(res => {
            const data = res.data;
            console.log(data);
        })
    }

    const testHandleUpload = async () => {
        const formData = new FormData();
        formData.append('message', 'test');
        const response = await fetch('http://localhost:8000/api/upload/', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        console.log(data); // Handle response from backend
    }

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/api/upload/', {
                method: 'POST',
                body: formData,
                // Report progress of upload
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const progress = Math.round((loaded / total) * 100);
                    setUploadProgress(progress);
                },
            });
            const data = await response.json();
            console.log(data); // Handle response from backend
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={testHandleUpload}>Upload</button>
            <button onClick={testConn}>Test</button>
            {uploadProgress > 0 && (
                <div>
                    <p>Uploading: {uploadProgress}%</p>
                    <progress value={uploadProgress} max="100" />
                </div>
            )}
        </div>
    );
};

export default FileUploadForm;
