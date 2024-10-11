const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const { makeExecutableSchema } = require('graphql-tools');
const mongoose = require('mongoose');
const connectDB = require('./db');

const { typeDefs } = require('./graphql/typedefs');
const { resolvers } = require('./graphql/resolvers');
const { authMiddleware } = require('./middlewares/authMiddleware');
const { playlistLoader } = require('./graphql/playlist.loaders'); 
const { songLoader } = require('./graphql/song.loaders');

const Song = require('./models/song.model'); 
const PlayedSong = require('./models/played.model');  // Import PlayedSong model
const cron = require('node-cron');  // Import node-cron
const app = express();

const protectedExecutableSchema = makeExecutableSchema({ typeDefs, resolvers });
const protectedSchema = applyMiddleware(protectedExecutableSchema, authMiddleware);

// Middleware untuk parsing JSON
app.use(express.json());

// Middleware untuk autentikasi Basic
const basicAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied: No Credentials Sent' });
    }

    const [type, credentials] = authHeader.split(' ');

    if (type !== 'Basic' || !credentials) {
        return res.status(401).json({ message: 'Access Denied: Invalid Credentials' });
    }

    const decodedCredentials = Buffer.from(credentials, 'base64').toString('ascii');
    const [username, password] = decodedCredentials.split(':');

    if (username === 'resti' && password === '12354') {
        req.user = { username };
        return next();
    } else {
        return res.status(401).json({ message: 'Access Denied: Invalid Username or Password' });
    }
};

// Menggunakan middleware autentikasi Basic
app.use(basicAuthMiddleware);


const playSongCronJob = async () => {
    try {
        // Get the history of recently played songs, let's say within the last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);  // 1 hour ago
        const playedSongs = await PlayedSong.find({ playedAt: { $gte: oneHourAgo } });

        // Get an array of song IDs that have been played recently
        const playedSongIds = playedSongs.map(song => song.songId);

        // Find the next song to play that hasn't been played recently
        const nextSong = await Song.findOne({ _id: { $nin: playedSongIds } });

        if (!nextSong) {
            console.log('No song available to play.');
            return;
        }

        // Mark the song as played
        const playedSong = new PlayedSong({ songId: nextSong._id });
        await playedSong.save();

        console.log(`Song "${nextSong.title}" has been played at ${playedSong.playedAt} with id:"${nextSong._id}"`);
    } catch (error) {
        console.error('Error running cron job:', error);
    }
};

// Schedule the cron job to run every 5 minutes
cron.schedule('* * * * *', playSongCronJob);


// Endpoint untuk webhook
app.post('/webhook', async (req, res) => {
    const { id, title, artist, genre, duration, playlistIds } = req.body;

    try {
        // Temukan lagu berdasarkan ID
        const updatedSong = await Song.updateOne({ _id: id }, { $set: req.body });

        if (updatedSong.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Song not found' });
        }
        return res.json({ 
            success: true, 
            message: 'Song updated successfully',
            data: {
                id,
                title,
                artist,
                genre,
                duration,
                playlistIds,
            }, 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error updating song: ${error.message}` });
    }
});

// Menerapkan Apollo Server untuk skema yang dilindungi
const protectedServer = new ApolloServer({
    schema: protectedSchema,
    context: ({ req }) => ({
        req,
        playlistLoader,
        songLoader,
    }),
    introspection: true,
    playground: true,
});

// Menerapkan middleware Apollo Server
protectedServer.applyMiddleware({ app });
const PORT = 4000;
// Memulai server dan koneksi database
const serverStart = async () => {
    await connectDB(); // Pastikan koneksi ke database berhasil

    app.listen(PORT, () => {
        console.log(`Protected server running at http://localhost:${PORT}/graphql`);
        console.log(`Webhook endpoint at http://localhost:${PORT}/webhook`);
        console.log(`Cron job has started to play songs every 1 minutes`);
    });
};

serverStart();
