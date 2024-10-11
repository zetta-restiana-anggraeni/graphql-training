const Song = require('../models/song.model');
const Playlist = require('../models/playlist.model');
const PlayedSong = require('../models/played.model');
const User = require('../models/user.model');
const fetch = require('node-fetch');
const webhookUrl = 'https://webhook.site/044aa822-c79c-44d3-8b54-1818c4fbc2cb'; 
       
const resolvers = {
    Query: {
        songs: async (parent) => {return await Song.find();},
        song: async (parent, { _id } ) => {return await Song.findById(_id);}, 
        playlists: async (parent) => {return await Playlist.find();},
        playlist: async (parent, { _id } ) => {return await Playlist.findById(_id);},
        users: async (parent) => {return await User.find();},
        user: async (parent, { _id } ) => {return await User.findById(_id);},
    },
    Mutation: {
        fetchWebhook: async (parent, { title, artist, genre, duration, playlistIds }) => {
            const newSong = new Song({ title, artist, genre, duration, playlistIds });
            await newSong.save();
        
            // Meneruskan parameter mutasi ke webhook.site menggunakan node-fetch
            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, artist, genre, duration, playlistIds }),
                });
        
        
                if (!response.ok) {
                    throw new Error(`Failed to forward request: ${response.statusText}`);
                } // Menampilkan response dari webhook.site
        
                return {
                    success: true,
                    message: 'Data forwarded successfully to webhook!',
                    data: {
                        title,
                        artist,
                        genre,
                        duration,
                        playlistIds,
                    }, 
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error forwarding request: ${error.message}`,
                };
            }
        },
        
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
            // console.log(`PLAYLIST ID :::: ${playlistIds}`)
            return await playlistLoader.loadMany(playlistIds);
        }
    },
    SongDetails: {
        songId: async (parent, _, { songLoader }) => {
            const songIds = parent.songId;
            // console.log(`SONG ID :::: ${songIds}`);
            return await songLoader.load(songIds);
        },
    },
};

module.exports = { resolvers };








        
        
        