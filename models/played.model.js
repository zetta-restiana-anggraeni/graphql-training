const mongoose = require('mongoose');

const playedSongSchema = new mongoose.Schema({
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' }, // Reference to Song model
    playedAt: { type: Date, default: Date.now }
});

module.exports =  mongoose.model('PlayedSong', playedSongSchema);

