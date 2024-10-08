const mongoose = require('mongoose');


const bookshelfSchema = new mongoose.Schema({
    bsName: {
        type: String, 
        required: true, 
    },
    bsGenre: {
        type: String, 
        required: true,
    },
    listBook: [{
        bookId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Book',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        } 
    }],    
}, { versionKey: false });

module.exports = mongoose.model('Bookshelf', bookshelfSchema);




