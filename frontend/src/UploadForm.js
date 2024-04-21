import React, {useState} from 'react';
import axios from 'axios';

const UploadForm = ({onServerResponse}) => {
    const uploadControlStyle = { backgroundColor: '#4E4096', color: 'white', border: 'none', fontSize: '24px', padding: '10px', borderRadius: '10px', fontFamily: 'Segoe UI'}

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [link, setLink] = useState("");
    const [displayUploadPrompt, setDisplayUploadPrompt] = useState(false);
    const [mode, setMode] = useState("playlist")

    function switchModes() {
        setMode(mode === "playlist" ? "single" : "playlist");
    }


    function handleFileChange(e) {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    function handleLinkChange(e) {
        setLink(e.target.value)
    }

    async function uploadFile() {
        setDisplayUploadPrompt(true);
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
        setDisplayUploadPrompt(false);
    }

    async function uploadLink(link) {
        setDisplayUploadPrompt(true);
        const url = 'http://localhost:8000/api/playlist/';
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
            {mode === "playlist" ?
                (
                    <div>
                        <p style={{fontFamily: 'Segoe UI', fontSize: '48px', textAlign: 'center', color: 'white'}}>Enter Any Spotify Playlist Link To Start</p>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <input
                                type="text"
                                value={link}
                                onChange={handleLinkChange}
                                placeholder="Type something..."
                            />
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <button onClick={uploadLink} style={{...uploadControlStyle, marginTop: '30px', paddingTop: '7px', cursor: 'pointer'}}>Upload</button>
                        </div>
                        {displayUploadPrompt ?
                            <p style={{fontFamily: 'Segoe UI', fontSize: '18px', textAlign: 'center', color: 'white', marginTop: '5px'}}>
                                Processing file. This may take up to 10 minutes depending on the length of the file uploaded
                            </p>
                            :
                            <></>
                        }
                    </div>
                )
                :
                (
                    <div>
                        <p style={{fontFamily: 'Segoe UI', fontSize: '48px', textAlign: 'center', color: 'white'}}>Upload Any Mp3 File To Start</p>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <label htmlFor="fileInput" style={{...uploadControlStyle, position: 'relative', overflow: 'hidden'}}>Choose File
                                <input id="fileInput" type="file" onChange={handleFileChange} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                            </label>
                        </div>
                        <p style={{fontFamily: 'Segoe UI', fontSize: '18px', textAlign: 'center', color: 'white', marginTop: '5px'}}>{fileName}</p>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <button onClick={uploadFile} style={{...uploadControlStyle, marginTop: '30px', paddingTop: '7px', cursor: 'pointer'}}>Upload</button>
                        </div>
                        {displayUploadPrompt ?
                            <p style={{fontFamily: 'Segoe UI', fontSize: '18px', textAlign: 'center', color: 'white', marginTop: '5px'}}>
                                Processing file. This may take up to 10 minutes depending on the length of the file uploaded
                            </p>
                            :
                            <></>
                        }
                    </div>
                )

            }

        </div>
    );
};

export default UploadForm;
