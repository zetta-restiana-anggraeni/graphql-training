const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema, introspectSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');
const DataLoader = require('dataloader');

const connectDB = require('./db');
const { typeDefs } = require('./graphql/typedefs');
const { resolvers } = require('./graphql/resolvers');
const { publicTypeDefs, publicResolvers } = require('./public/public');
const { authMiddleware } = require('./middlewares/authMiddleware');
const { playlistLoader } = require('./graphql/playlist.loaders'); 
const { songLoader } = require('./graphql/song.loaders');
const jwt = require('jsonwebtoken');
const app = express();

const secretKey = 'admin1234';
const protectedExecutableSchema = makeExecutableSchema({ typeDefs:typeDefs, resolvers:resolvers });
const publicExecutableSchema = makeExecutableSchema({ typeDefs: publicTypeDefs, resolvers: publicResolvers });
const protectedSchema = applyMiddleware(protectedExecutableSchema, authMiddleware);
const publicSchema = applyMiddleware(publicExecutableSchema);

const serverStart = async () => {
    await connectDB();

    app.use((req, res, next) => {
        const token = req.headers.authorization || '';
        if (token) {
            try {
                const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
                req.user = decoded;  
            } catch (err) {
                req.user = null; 
            }
        } else {
            req.user = null;  
        }
        next();
    });
    
    const publicServer = new ApolloServer({
        schema: publicSchema,
        context: ({ req }) => ({
            req, 
        }),
        introspection: true,
        playground: true
    });

    const protectedServer = new ApolloServer({
        schema: protectedSchema,
        context: ({ req }) => ({
            req, 
            user: req.user,
            playlistLoader,
            songLoader
        }),
        introspection: true,
        playground: true
    });

    publicServer.applyMiddleware({ app, path: '/public'});
    protectedServer.applyMiddleware({ app, path: '/graphql'});

    app.listen({ port: 4000 }, () => {
        console.log(`Public server running at http://localhost:4000/public`);
        console.log(`Protected server running at http://localhost:4000/graphql`);
    });
}; 

serverStart();