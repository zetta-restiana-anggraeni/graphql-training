const mongoose = require('mongoose');
mongoose.set('debug', true);

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/book-db', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true    
        });
        console.log('MongoDB Connected!');
    } catch (error) {
        console.log('MongoDB Connection Error:', error);
        process.exit(1);
    } 
};

module.exports = connectDB;