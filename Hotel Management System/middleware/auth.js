const jwt = require("jsonwebtoken")
const config = process.env;

const verifyToken = (req,res,next) =>{
    let token = req.cookies['accesstoken']
    if(!token){
        return res.status(403).send("A Token is required for authentication")
    }
    try {
        const decoded = jwt.verify(token,config.TOKEN_KEY);
        req.user = decoded;
    } catch (error) {
        return res.status(401).send("Invalid Token")
    }
    return next();
}

module.exports = verifyToken