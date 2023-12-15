const jwt = require('jsonwebtoken');

// jwt authentication
function createToken(payload, options,) {
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, options);
        return token;
    } catch (error) {
        throw new Error('Error creating JWT token');
    }
}

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized - Token not provided' });
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Unauthorized - Invalid authorization header' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

}


module.exports = { createToken, verifyToken };