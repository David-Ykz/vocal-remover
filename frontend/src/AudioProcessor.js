function base64ToBlob(base64String, mimeType) {
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: mimeType });
}

export function createAudioUrl(audioData) {
    try {
        const blob = base64ToBlob(audioData, 'audio/mp3');
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error creating audio URL:', error);
    }
}
