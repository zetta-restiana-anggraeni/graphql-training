const Song = require('../models/song.model');

const playSongCronJob = async () => {
    try {
        let songs = await Song.find({played: false}).sort({title:1});
        
        if(songs.length > 0){
            const songToPlay = songs[0];
            console.log(`Now Playing: ${songToPlay.title}`);
            songToPlay.played = true;
            await songToPlay.save();
            return songToPlay.title;
        }else{
            songs = await Song.updateMany({}, {played: false});
        }

    } catch (error) {
        console.error('Error running cron job:', error);
        return 'Failed to play the song';
    }
};

module.exports = { playSongCronJob };