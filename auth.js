const jwt = require('jsonwebtoken');
const secretkey = 'i dont want to use this in real, use a secure key instead';

function auth(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).send('Token missing');
    }

    const decoded = jwt.verify(token, secretkey); 
    
    if(!decoded) {
        return res.status(401).send('Invalid token');
    }
    req.id = decoded.id; // store the username in req for further use
    next();

}

module.exports = auth;