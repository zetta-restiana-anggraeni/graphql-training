const { gql } = require('apollo-server-express');
const Book = require('../models/book.model'); // Impor model Book

// Set up GraphQL schema
const typeDefs = gql`
    type Query {
        books: [Book]
    }

    type Mutation {
        addBook(
            title: String!
            author: String!
            genre: String!
            stock: Int!
        ): Book
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
            return await Book.find(); // Mengambil semua buku dari MongoDB
        }
    },
    Mutation: {
        addBook: async (parent, { title, author, genre, stock }) => {
            const newBook = new Book({ title, author, genre, stock });
            await newBook.save(); // Menyimpan buku baru ke MongoDB
            return newBook;
        }
    }
};

module.exports = { typeDefs, resolvers };
