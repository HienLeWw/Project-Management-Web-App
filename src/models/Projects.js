const Mongoose = require('mongoose');
const Project_schema = new Mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Make a name for your project pls']
    },

    admin: {
        type: String,
        required: [true, 'A project need an admin']
    },

    task: {
        type: [String]
    }

});

const Project = Mongoose.model('Project', Project_schema);
module.exports = Project;