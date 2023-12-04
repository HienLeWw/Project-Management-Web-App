require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.db_conn)
const db = mongoose.connection
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('connected to the database'))
