const LyricsVisualizer = ({lyrics}) => {
    function processLyrics(lyrics) {
        lyrics = lyrics.substring(lyrics.indexOf("["));
        lyrics = lyrics.replace("See Coldplay LiveGet tickets as low as $106You might also like", "\n");
        // 242Embed
        return lyrics
    }


    return (
        <div style={{marginLeft: '5px', marginRight: '5px'}}>
            <pre style={{fontFamily: 'Segoe UI', fontSize: '16px', color: 'white', overflowWrap: 'break-word', whiteSpace: 'pre-wrap'}}>{processLyrics(lyrics)}</pre>
        </div>
    );
}

export default LyricsVisualizer;