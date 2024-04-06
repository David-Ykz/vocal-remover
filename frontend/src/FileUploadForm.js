import React, { useState } from 'react';
import axios from 'axios';

const FileUploadForm = ({ onFileUpload }) => {
    const serverUrl = 'http://localhost:8000/api/';
    const testUrl = serverUrl + 'test/';
    const uploadUrl = serverUrl + 'upload/';

    const [file, setFile] = useState(null);

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
            const response = await axios.post('http://localhost:8000/api/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'  // Ensure correct content type
                }
            });
            console.log(response.data);  // Handle response from backend
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <button onClick={testConn}>Test</button>
        </div>
    );
};

export default FileUploadForm;
