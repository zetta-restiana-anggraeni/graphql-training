const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Song {
        _id: ID
        title: String
        artist: String
        genre: String
        duration: Int
        playlistIds: [Playlist]
    }

    type Playlist {
        _id: ID
        name: String
        desc: String
        songList: [SongDetails]
    }
    
    type SongDetails {
        songId: Song
    }

    type User {
        _id: ID
        username: String
        password: String
    }

    type Query {
        songs: [Song]
        song(_id: ID!): Song
        playlists: [Playlist]
        playlist(_id: ID!): Playlist
        users: [User]
        user(_id: ID!): User
    }

    type Mutation {
        addSong(
            title: String!
            artist: String!
            genre: String!
            duration: Int!
            playlistIds: [ID!]  
        ): Song!

        addPlaylist(
            name: String!
            desc: String!
            songList: [SongDetailsInput!]  
        ): Playlist!

        updateSong (
            _id: ID!
            input: SongUpdate!
        ): Song!

        updatePlaylist(
            _id: ID!
            input: PlaylistUpdate!
        ):Playlist!

        deleteSong(_id: ID!):Song!
        deletePlaylist(_id: ID!):Playlist!
    }

    input SongUpdate {
        title: String
        artist: String
        genre: String
        duration: Int
        playlistIds:[ID!]  
    }

    input PlaylistUpdate {
        name: String
        desc: String
        songList: [SongDetailsInput!]  
    }

    input SongDetailsInput {
        songId: ID!
    }

`;

module.exports = { typeDefs };
