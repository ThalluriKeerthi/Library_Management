import jwt from "jsonwebtoken";

export const isAuthenticated = async(req, res, next) => {
    const token = req.cookies.token;
    try{
        if(!token) {
        return res.json({
            success : false,
            message : "Please Login first"
          })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(error) {
        return res.status(401).json({
            success : false,
            message : "Invalid or expired token",
            error : error.message
        })
    }
}

export const isAdmin = async(req, res, next) => {
    try {
        if(!req.user || req.user.role !== "admin") {
            return res.status(403).json({
            success : false,
            message : "Access denied, Admin Only"
          })
        }
        next();
    } catch(error) {
        return res.status(401).json({
            success : false,
            message : "Authorization failed",
            error : error.message
        })
    }
} 