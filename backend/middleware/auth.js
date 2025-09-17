import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: token_decode.id }; // Attach user ID to request object
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Error" });
    }
};

export default authMiddleware;