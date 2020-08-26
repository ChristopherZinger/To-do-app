const jwt = require('jsonwebtoken');

// UTILS
function authenticateToken(req, res, next) {
    /*
        Authenticate token and add user model to the req
        in case of wrong or missing JWT 
        this middleware returns null
    */

    // check token from headres
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // token is missing, return empty user
        req.user = null;
        return next();
    }
    // verify token and return user
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // fobridden access, return empty user
            req.user = null;
            return next();
        }
        // return user in request
        req.user = user;
        return next();
    })
}


module.exports = authenticateToken;