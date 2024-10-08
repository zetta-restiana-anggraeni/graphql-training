const { gql } = require('apollo-server-express');
const Book = require('../models/book.model'); 

const typeDefs = gql`
    type Query {
        books: [Book]
        bookById(id: ID!): Book
    }

    type Mutation {
        addBook(
            title: String!
            author: String!
            genre: String!
            stock: Int!
        ): Book

        updateBook(
            id: ID!
            title: String!
            author: String!
            genre: String!
            stock: Int!
        ): Book

        deleteBook(id: ID!): Book
    }

    type Book {
        id: ID!
        title: String!
        author: String!
        genre: String!
        stock: Int!
    }
`;

const resolvers = {
    Query: {
        books: async () => {
            return await Book.find();
        },
        bookById: async (parent, { id }) => {
            return await Book.findById(id); 
        }
    },
    Mutation: {
        addBook: async (parent, { title, author, genre, stock }) => {
            const newBook = new Book({ title, author, genre, stock });
            await newBook.save(); 
            return newBook;
        },
        updateBook: async (parent, { id, title, author, genre, stock }) => {
            const updatedBook = await Book.findByIdAndUpdate(
                id,
                { title, author, genre, stock },
                { new: true } 
            );
            return updatedBook;
        },
        deleteBook: async (parent, { id }) => {
            const deletedBook = await Book.findByIdAndDelete(id); 
            return deletedBook;
        }
    }
};

module.exports = { typeDefs, resolvers };
