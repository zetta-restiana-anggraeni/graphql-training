const authMiddleware = (resolve, parent, args, context, info) => {
    const { req } = context;

    if (!req.user) {
        throw new Error('Not Authenticated');
    }
    // console.log(`User berhasil diambil dari context: ${JSON.stringify(req.user)}`);
    return resolve(parent, args, context, info);
};

module.exports = { authMiddleware };



