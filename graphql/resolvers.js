const Song = require('../models/song.model');
const Playlist = require('../models/playlist.model');
const User = require('../models/user.model');

const resolvers = {
    Query: {
        songs: async () => {
            return await Song.find();
        },
        song: async (parent, { _id }) => {
            return await Song.findById(_id);
        }, 
        playlists: async () => {
            return await Playlist.find();
        },
        playlist: async (parent, { _id }) => {
            return await Playlist.findById(_id);
        },
        users: async () => {
            return await User.find();
        },
        user: async (parent, { _id }) => {
            return await User.findById(_id);
        },
    },
    Mutation: {
        addSong: async (parent, { title, artist, genre, duration, playlistIds }) => {
            const newSong = new Song({ title, artist, genre, duration, playlistIds });
            await newSong.save();
            return newSong;
        },
        addPlaylist: async (parent, { name, desc, songList }) => {
            const newPlaylist = new Playlist({
                name,
                desc,
                songList: songList.map(song => ({
                    songId: song.songId
                }))
            });
        
            await newPlaylist.save();
            return newPlaylist;
        },

        updateSong: async (parent, { _id, input }) => {
            await Song.updateOne({ _id: _id }, { $set: input });
            const updatedSong = await Song.findById({_id});
            return updatedSong;
        },
    
        updatePlaylist: async (parent, { _id, input }) => {
            await Playlist.updateOne({ _id: _id }, { $set: input});
            const updatedPlaylist = await Playlist.findById(_id);
            return updatedPlaylist;
        },
        deleteSong: async (parent, { _id }) => {
            const result = await Song.deleteOne({ _id: _id });
            return result;
        },
        deletePlaylist: async (parent, { _id }) => {
            const result = await Playlist.deleteOne({ _id: _id });
            return result;
        },
    },
    Song:{
        playlistIds: async (parent, _, { playlistLoader }) => {
            const playlistIds = parent.playlistIds;
            console.log(`PLAYLIST ID :::: ${playlistIds}`)
            return await playlistLoader.loadMany(playlistIds);
        }
    },
    SongDetails: {
        songId: async (parent, _, { songLoader }) => {
            const songIds = parent.songId;
            console.log(`SONG ID :::: ${songIds}`);
            return await songLoader.load(songIds);
        },
    },
};

module.exports = { resolvers };








        
        
        