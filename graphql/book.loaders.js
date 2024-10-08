const DataLoader = require('dataloader');
const Book = require('../models/book.model');

const bookLoader = new DataLoader(async (ids) => {
    const books = await Book.find({ _id: { $in: ids} });
    const bookMap = {};
    books.forEach(book => {
        bookMap[book._id] = book;
    });
    return ids.map(id => bookMap[id]); 
});


module.exports = { bookLoader }; 