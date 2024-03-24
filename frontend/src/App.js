import React from 'react';
import FileUploadForm from './FileUploadForm';

const App = () => {
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://your-django-backend/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data); // Handle response from backend
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
      <div>
        <h1>Upload MP3 File</h1>
        <FileUploadForm onFileUpload={handleFileUpload} />
      </div>
  );
};

export default App;
