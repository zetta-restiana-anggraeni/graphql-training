const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect('mongodb://localhost:27017/book-gql-2', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false 
        });
        console.log('MongoDB Connected!');
    } catch (error) {
        console.log('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;