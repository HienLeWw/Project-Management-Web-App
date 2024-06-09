require('dotenv').config()
const mongoose = require('mongoose')
const uri = 'mongodb://127.0.0.1:27017/phpWebApp';
mongoose.connect(uri)
const db = mongoose.connection
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('connected to the database'))
