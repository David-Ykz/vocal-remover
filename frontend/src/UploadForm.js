import React, {useState} from 'react';
import axios from 'axios';

const UploadForm = ({onServerResponse}) => {
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
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadForm;
