const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true, 
    },
    author: {
        type: String,
        required: true, 
    },
    genre: {
        type: String, 
        required: true,
    },
    stock: {
        type: Number, 
        required: true, 
    },
    bookshelfIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Bookshelf' 
    }]
}, { versionKey: false });

module.exports = mongoose.model('Book', bookSchema);
