import jwt from "jsonwebtoken";
import userModel from "../Models/userModel.js";

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Authorization header missing or invalid:', authHeader);
        return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('Token missing in authorization header');
        return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', token_decode);
        const user = await userModel.findById(token_decode.id);
        if (!user) {
            console.log('User not found for id:', token_decode.id);
            return res.status(401).json({ success: false, message: "User not found" });
        }
        req.user = { _id: user._id, isAdmin: user.isAdmin }; // Attach user ID and isAdmin to request object
        next();
    } catch (error) {
        console.log('JWT verification error:', error);
        res.status(401).json({ success: false, message: "Error" });
    }
};

export default authMiddleware;