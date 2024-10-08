const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');
const DataLoader = require('dataloader'); 
const connectDB = require('./db');

const { typeDefs, resolvers } = require('./graphql/index');
const { authMiddleware } = require('./middlewares/authMiddleware');
const { bookshelfLoader } = require('./graphql/bookshelf.loaders'); 
const { bookLoader } = require('./graphql/book.loaders'); 

const app = express();
const executableSchema = makeExecutableSchema({ typeDefs, resolvers });
const protectedSchema = applyMiddleware(executableSchema, authMiddleware); 

const serverStart = async () => {
    app.use(authMiddleware);
    await connectDB();

    const server = new ApolloServer({
        schema: protectedSchema,
        context: ({ req }) => ({
            req,
            bookshelfLoader, 
            bookLoader
        }),
        introspection:true,
        playground: true
    })
    
    server.applyMiddleware({ app });

    app.listen({ port: 5003 }, () =>
        console.log(`Server running at http://localhost:5003${server.graphqlPath}`)
    );
};

serverStart();