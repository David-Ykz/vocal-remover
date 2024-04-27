const LyricsVisualizer = ({lyrics}) => {
    const textToRemove = ["206Embed", "See Coldplay LiveGet tickets as low as $106", "242Embed", "You might also like", "Embed", "428", "84", "101", "276", "18", "174"]

    function processLyrics(lyrics) {
        lyrics = lyrics.substring(lyrics.indexOf("["));
        for (let i in textToRemove) {
            lyrics = lyrics.replace(textToRemove[i], "");
        }
        return lyrics
    }


    return (
        <div style={{marginLeft: '5px', marginRight: '5px'}}>
            <pre style={{fontFamily: 'Segoe UI', fontSize: '16px', color: 'white', overflowWrap: 'break-word', whiteSpace: 'pre-wrap'}}>{processLyrics(lyrics)}</pre>
        </div>
    );
}

export default LyricsVisualizer;