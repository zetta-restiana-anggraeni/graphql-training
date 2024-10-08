const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');

const connectDB = require('./db'); 

// Impor typeDefs dan resolvers dari file graphql
const { typeDefs, resolvers } = require('./graphql/index');
// const { authMiddleware } = require('./middlewares/authMiddleware');

const app = express();
const secretKey = 'admin1234'; // Pastikan secretKey didefinisikan
const executableSchema = makeExecutableSchema({ typeDefs, resolvers });
const protectedSchema = applyMiddleware(executableSchema); //authMiddleware


const startServer = async () => {
    await connectDB();
    
    // Setup Apollo Server
    const server = new ApolloServer({
        schema: protectedSchema,
        context: ({ req }) => ({
            req,  // Mengambil req secara langsung
        }),
        introspection: false, 
    });

    // Terapkan middleware Apollo Server ke aplikasi Express
    server.applyMiddleware({ app });

    // Mulai server Apollo
    app.listen({ port: 5000 }, () =>
        console.log(`Server running at http://localhost:5000${server.graphqlPath}`)
    );

};

startServer();