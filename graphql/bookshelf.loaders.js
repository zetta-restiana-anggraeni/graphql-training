const DataLoader = require('dataloader');
const Bookshelf = require('../models/bookshelf.model'); 

const bookshelfLoader = new DataLoader(async (ids) => {
    const bookshelves = await Bookshelf.find({ _id: { $in: ids } });
    const bookshelfMap = {};
    bookshelves.forEach(bookshelf => {
        bookshelfMap[bookshelf._id] = bookshelf;
    });
    return ids.map(id => bookshelfMap[id]); 
});

module.exports = { bookshelfLoader }; 

