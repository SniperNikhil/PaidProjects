const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    let token = req.cookies['x-access-token'];

    if (!token) {  
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY1);    
        req.user = decoded;                                    
    } catch (err) {
        return res.status(401).send("Invalid Token");  
    }
    return next();
};

module.exports = verifyToken; 
