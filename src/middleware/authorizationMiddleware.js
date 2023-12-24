require('dotenv').config();
const User = require('../models/Users');
const Project = require('../models/Projects');

const authorization = async (req, res, next) => {
    try {
        console.log("da toi ham nay")
        console.log(req.query.id)
        const user = await User.findById(req.user.id);
        //take object value and check if id of the project is in the user
        if (Object.values(user['project_ID']).indexOf(req.query.id) >= 0) {
            console.log("pass");
            next();
        }
        else {
            res.redirect('/')
        }
    }
    catch (error) {
        console.log("loi cho author ne")
        res.redirect('/')
    }
}

module.exports = { authorization }