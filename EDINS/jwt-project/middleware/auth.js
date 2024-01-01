//This is Admin Authentication file 
//we are using token for authentication
//For this we have an inbuild Package called jsonwebtoken
// we are importing jsonwebtoken
const jwt = require("jsonwebtoken");

// it represents the state of the system environment our application is in when it starts
//here we created obj for accessing  TOKEN_KEY1 present in .env
const config = process.env;

//Here we will be verifing the token
const verifyToken = (req, res, next) => {
    //Here we are getting the token from browser using cookies
    //Note that we have given (x-access-token) as the name of cookie
    let token = req.cookies['x-access-token'];

    if (!token) {   //if user trying to access does not have a token he will get this message
        return res.status(403).send("A token is required for authentication");
    }
    try {   //this may sometimes return an exception so we used try catch
        const decoded = jwt.verify(token, config.TOKEN_KEY);    //Here we are verifying the token with the users token
        req.user = decoded;                                     //if the token does not match it will return exception
    } catch (err) {
        return res.status(401).send("Invalid Token");  
        //if any other user(staff,student) with diffrent token try to access admin page 
        //He will get this Message
    }
    return next();
};

module.exports = verifyToken; //Here we are exporting our verified token so that we can make use of it in other file

/*
Using return next(): If you have any middleware function and below the return next()
 you have some lines that you want to execute, then the lines which are below return next()
 won’t be executed because it will jump out the callback
immediately and the code below return next() in the callback will be unreachable.*/