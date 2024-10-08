const DataLoader = require('dataloader');
const Playlist = require('../models/playlist.model')

const playlistLoader = new DataLoader(async (ids) => {
    const playlists = await Playlist.find({ _id: { $in: ids } });
    const playlistMap = {};
    playlists.forEach(playlist => {
        playlistMap[playlist._id] = playlist
    });
    return ids.map(id => playlistMap[id]);
});

module.exports = { playlistLoader };