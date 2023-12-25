const mongoose = require('mongoose');
const Task_Schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name your task"]
    },

    user_ids: {
        type: [String],
        required: [true, "need at least 1 worker assign to this task"]
    },

    master_project: {
        type: String,
        required: [true, "who own this task?"]
    },

    content: {
        type: String,
        required: [true, "at least leave sth to describe the task"]
    },

    status: {
        type: Number, // 0: To do, 1: In progress, done = true => Done: 2
                      // 3: Due to. *Due to: quá hạn;
        required: [true, "set a status for this task"]
    },

    created_date: {
        type: Date,
        required: [true, "when is the begining of this task?"]
    },

    end_date: {
        type: Date,
        required: [true, "give this a deadline"]
    },

})

const Task = mongoose.model('Task', Task_Schema);
module.exports = Task;