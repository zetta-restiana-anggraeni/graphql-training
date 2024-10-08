const DataLoader = require('dataloader');
const Song = require('../models/song.model')

const songLoader = new DataLoader(async (ids) => {
    const songs = await Song.find({ _id: { $in: ids} });
    const songMap = {};
    songs.forEach(song => {
        songMap[song._id] = song;
    });
    return ids.map(id => songMap[id]);
});

module.exports = { songLoader };