require('dotenv').config();
const User = require('../models/Users');
const Project = require('../models/Projects');

const authorization = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (req.query.id in user['project_ID']) {
            next();
        }
        else {
            res.redirect('/')
        }
    }
    catch (error) {
        res.redirect('/')
    }
}

module.exports = { authorization }