require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

//check login user
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
            if (err) {
                console.log("thong bao loi o authmiddleware")
                console.log(err.message);
                res.redirect('/login')
            }
            else {
                console.log(decodedToken);
                next();
            }
        })
    }
    else {
        res.redirect('/login');
    }

}

//check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log(token)
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log("loi verify")
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                req.user = user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };