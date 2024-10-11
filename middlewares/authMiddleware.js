const authMiddleware = (resolve, parent, args, context, info) => {
    const { req } = context;

    if (!req.user) {
        throw new Error('Not Authenticated');
    }
    return resolve(parent, args, context, info);
};

module.exports = { authMiddleware };



