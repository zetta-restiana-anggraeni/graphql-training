const jwt = require('jsonwebtoken');
const secretKey = 'admin1234';

// Fungsi untuk menghasilkan token
const generateToken = (username) => {
    return jwt.sign({ username }, secretKey, { expiresIn: '1h' });
};

// Ganti 'yourUsername' dengan username yang ingin digunakan
const token = generateToken('restiana');
console.log(token);  // Ini adalah token yang akan kamu gunakan untuk autentikasi
