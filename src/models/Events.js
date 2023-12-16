const Mongoose = require('mongoose');
const eventSchema = new Mongoose.Schema({
    id: {
        type: String,
        required: [true, 'Make a name for your project pls']
    },
    tittle: {
        type: String,
        required: [true, 'need a title for an event']
    },
    body: {
        type: String
    },
    idProject: {
        type: String,
        required: true
    },
    dateStart: {
        type: Date,
        required: true
    },
    dateEnd: {
        type: Date,
        required: true
    }

});

const Event = Mongoose.model('Event', eventSchema);
module.exports = Event;