const { gql } = require('apollo-server-express');
const Book = require('../models/book.model');
const Bookshelf = require('../models/bookshelf.model');

const typeDefs = gql`
    type Book {
        _id: ID
        title: String
        author: String
        genre: String
        stock: Int
        bookshelfIds: [Bookshelf]
    }

    type Bookshelf {
        _id: ID
        bsName: String
        bsGenre: String
        listBook: [BookDetails]
    }
    
    type BookDetails {
        bookId: Book
        rating: Float
    }

    type Query {
        books: [Book]
        book(_id: ID!): Book
        bookshelves: [Bookshelf]
        bookshelf(_id: ID!): Bookshelf
    }

    type Mutation {
        addBook(
            title: String!
            author: String!
            genre: String!
            stock: Int!
            bookshelfIds: [ID!]  
        ): Book!

        addBookshelf(
            bsName: String!
            bsGenre: String!
            listBook: [BookDetailsInput!]  
        ): Bookshelf!

        updateBook(
            _id: ID!
            input: BookUpdate!
        ):Book!

        updateBookshelf(
            _id: ID!
            input: BookshelfUpdate!
        ):Bookshelf!

        deleteBook(_id: ID!):Book!
        deleteBookshelf(_id: ID!):Bookshelf!
    }

    input BookUpdate {
        title: String
        author: String
        genre: String
        stock: Int
        bookshelfIds:[ID!]  
    }

    input BookshelfUpdate {
        bsName: String
        bsGenre: String
        listBook: [BookDetailsInput!]  
    }

    input BookDetailsInput {
        bookId: ID!
        rating: Float!
    }

    
`;

const resolvers = {
    Query: {
        books: async () => {
            return await Book.find();
        },
        book: async (parent, { _id }) => {
            return await Book.findById(_id);
        }, 
        bookshelves: async () => {
            return await Bookshelf.find();
        },
        bookshelf: async (parent, { _id }) => {
            return await Bookshelf.findById(_id);
        },
    },
    Mutation: {
        addBook: async (parent, { title, author, genre, stock, bookshelfIds }) => {
            const newBook = new Book({ title, author, genre, stock, bookshelfIds });
            await newBook.save();
            return newBook;
        },
        addBookshelf: async (parent, { bsName, bsGenre, listBook }) => {
            const newBookshelf = new Bookshelf({ 
                bsName, 
                bsGenre, 
                listBook: listBook.map(book => ({ 
                    bookId: book.bookId, 
                    rating: book.rating 
                })) 
            });
            await newBookshelf.save();
            const populatedBookshelf = await Bookshelf.findById(newBookshelf._id);
            return populatedBookshelf;
        },

        updateBook: async (parent, { _id, input }) => {
            await Book.updateOne({ _id: _id }, { $set: input });
            const updatedBook = await Book.findById({_id});
            return updatedBook;
        },

        updateBookshelf: async (parent, { _id, input }) => {
            await Bookshelf.updateOne({ _id: _id }, { $set: input});
            const updatedBookshelf = await Bookshelf.findById(_id);
            return updatedBookshelf;
        },
        
        deleteBook: async (parent, { _id }) => {
            const result = await Book.deleteOne({ _id: _id });
            return result;
        },
        deleteBookshelf: async (parent, { _id }) => {
            const result = await Bookshelf.deleteOne({ _id: _id });
            return result;
        },
    },
    Book:{
        bookshelfIds: async (parent, _, { bookshelfLoader }) => {
            const bookshelfIds = parent.bookshelfIds;
            console.log(`BOOKSHELF IDS ::::: ${bookshelfIds}`)
            return await bookshelfLoader.loadMany(bookshelfIds);
        }
    },

    BookDetails: {
        bookId: async (parent, _, { bookLoader }) => {
            const bookIds = parent.bookId;
            console.log(`BOOK IDS ::::: ${bookIds}`);
            return await bookLoader.load(bookIds);
        },
    },
};

module.exports = { typeDefs, resolvers };
