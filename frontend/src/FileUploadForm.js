import React, { useState } from 'react';

const FileUploadForm = ({ onFileUpload }) => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const testConn = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/test/', {
                method: 'GET',

            });
            const data = await response.json();
            console.log(data); // Handle response from backend
        } catch (error) {
            console.error('Error:', error);
        }
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
            <button onClick={handleUpload}>Upload</button>
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
