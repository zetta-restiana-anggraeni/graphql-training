const authMiddleware = (resolve, parent, args, context, info) => {
    const { req } = context;

    // Cek apakah ada header Authorization
    const auth = req.headers["authorization"];
    if (!auth) {
        throw new Error('Access Denied: No authorization header');
    }

    // Memisahkan dan mendekodekan token
    const userpass = auth.split(" ")[1];
    const text = Buffer.from(userpass, "base64").toString("ascii");
    const [username, password] = text.split(":");

    // Definisikan username dan password secara langsung
    const USERNAME = 'admin';
    const PASSWORD = '123';

    // Verifikasi username dan password
    if (username !== USERNAME || password !== PASSWORD) {
        throw new Error('Access Denied: Invalid credentials');
    }

    // Jika terautentikasi, lanjutkan ke resolver
    return resolve(parent, args, context, info);
};

module.exports = { authMiddleware };
