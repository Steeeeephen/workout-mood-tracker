import jwt from 'jsonwebtoken';


export const authenticateToken = (req, res, next) => {
    // Variable for token sent in header
    const authHeader = req.headers['authorization'];
    // Splitting authHeader by space
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({ message: "Access denied. No token provided." })
    }

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.userId = decoded.userId;

        next()
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

