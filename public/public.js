const { gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const secretKey = "admin1234";

const publicTypeDefs = gql`
    type Query{
        user(_id: ID!): User
    }

    type User {
        _id: ID
        username: String
        password: String
        role: String
    }

    type Mutation {
        register(
            username: String!
            password: String!
        ): String!

        login(
            username: String!
            password: String!
        ): String!
    }

`;


const publicResolvers = {
    Query: {
        user: async (parent, { _id }, { req }) => {
            if (!req.user) {
                throw new Error('Not Authenticated');
            }
            if (req.user.role !== 'Admin') {
                throw new Error('Access Denied');
            }
            return await User.findById(_id);
        },
    }, 
    Mutation: {
        register: async (parent, { username, password }) => {
            let message = "";
            const hashedPassword = await bcrypt.hash(password, 10);
            if(password===secretKey){
                const newAdmin = new User({ username, password: hashedPassword, role:"Admin" });
                await newAdmin.save();
                message = "Admin Successfully Registered!";
            }else{
                const newUser = new User({ username, password: hashedPassword, role: "Listener" });
                await newUser.save();
                message = "User Successfully Registered!";
            }
            return message;
        },
        login: async (parent, { username, password }) => {
            const user = await User.findOne({ username: username });
            if (!user) {
                throw new Error('User not found');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password); // Cek password
            if (!isPasswordValid) {
                throw new Error('Invalid username or password');
            }
            if(user && isPasswordValid){
                return jwt.sign({ userId: user._id, username: user.username, role:user.role }, secretKey); //, { expiresIn: '1h' }
            }
        },  
    },
};

module.exports = { publicTypeDefs, publicResolvers };








        
        
        