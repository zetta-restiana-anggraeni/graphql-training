const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');
const connectDB = require('./db'); 

// Impor typeDefs dan resolvers dari file graphql
const { typeDefs, resolvers } = require('./graphql/index');
const { authMiddleware } = require('./middlewares/authMiddleware');


const app = express();
const executableSchema = makeExecutableSchema({ typeDefs, resolvers });
const protectedSchema = applyMiddleware(executableSchema, authMiddleware);

app.use(authMiddleware);

const startServer = async () => {
    await connectDB();

    // Setup Apollo Server
    const server = new ApolloServer({
        schema: protectedSchema,
        context: ({ req }) => ({ req }),
        introspection: false, // Enable introspection for playground
    });

    // Terapkan middleware Apollo Server ke aplikasi Express
    server.applyMiddleware({ app });

    // Mulai server Apollo
    app.listen({ port: 5001 }, () =>
        console.log(`Server running at http://localhost:5001${server.graphqlPath}`)
    );
};

startServer();
