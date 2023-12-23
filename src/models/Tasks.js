const mongoose = require('mongoose');
const Task_Schema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "name your task"]
    },

    user_ids: {
        type: [String],
        require: [true, "need at least 1 worker assign to this task"]
    },

    master_project: {
        type: String,
        require: [true, "who own this task?"]
    },

    content: {
        type: String,
        require: [true, "at least leave sth to describe the task"]
    },

    status: {
        type: Number, // 0: To do, 1: In progress, 2: Done.
        require: [true, "set a status for this task"]
    },

    created_date: {
        type: Date,
        require: [true, "when is this created?"]
    },

    end_date: {
        type: Date,
        require: [true, "give this a deadline"]
    },
})

const Task = mongoose.model('Task', Task_Schema);
module.exports = Task;