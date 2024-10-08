const authMiddleware = (resolve, parent, args, context, info) => {
    const { req } = context;

    const auth = req.headers["authorization"];
    if (!auth) {
        throw new Error('Access Denied: No authorization header');
    }

    const userpass = auth.split(" ")[1];
    const text = Buffer.from(userpass, "base64").toString("ascii");
    const [username, password] = text.split(":");

    const USERNAME = 'admin';
    const PASSWORD = '123';


    if (username !== USERNAME || password !== PASSWORD) {
        throw new Error('Access Denied: Invalid credentials');
    }

    return resolve(parent, args, context, info);
};

module.exports = { authMiddleware };
