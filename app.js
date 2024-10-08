const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');
const connectDB = require('./db');

const { typeDefs, resolvers } = require('./graphql/index');
const { authMiddleware } = require('./middlewares/authMiddleware');

const app = express();
const executableSchema = makeExecutableSchema({ typeDefs, resolvers });
const protectedSchema = applyMiddleware(executableSchema, authMiddleware);

const serverStart = async () => {
    app.use(authMiddleware);

    await connectDB();

    const server = new ApolloServer({ 
        schema: protectedSchema,
        context: ({ req }) => ({ req }),
        introspection: false
    })

    server.applyMiddleware({ app });

    app.listen({ port: 5002 }, () =>
        console.log(`Server running at http://localhost:5002${server.graphqlPath}`)
    );
};

serverStart();
