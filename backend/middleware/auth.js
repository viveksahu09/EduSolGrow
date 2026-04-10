const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            console.log('Auth: No token provided');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        console.log('Auth: Full token received:', token);
        console.log('Auth: Token length:', token?.length);
        console.log('Auth: Token first 20 chars:', token?.substring(0, 20));
        console.log('Auth: Token last 20 chars:', token?.substring(token.length - 20));
        console.log('Auth: JWT_SECRET:', process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production');

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production');
        console.log('Auth: Token decoded successfully:', decoded);
        
        const user = await User.findById(decoded.id).select('-password');
        console.log('Auth: User found:', user ? user.username : 'null');

        if (!user) {
            console.log('Auth: User not found for ID:', decoded.id);
            return res.status(401).json({ message: 'Token is not valid' });
        }

        req.user = user;
        console.log('Auth: Authentication successful for:', user.username);
        next();
    } catch (error) {
        console.log('Auth: JWT verification failed:', error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;
