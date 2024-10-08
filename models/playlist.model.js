const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    songList: [{
      songId: {
          type: mongoose.Schema.ObjectId,
          ref: 'Song',
          required: true
      }
    }]
},{ versionKey: false });
  
module.exports = mongoose.model('Playlist', playlistSchema);

