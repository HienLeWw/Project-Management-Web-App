require('dotenv').config()
const express = require('express')
const configViewEngine = require('./config/viewEngine')
const webRoutes = require('./routes/web');
const projectRoute = require('./routes/Create_project')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

const app = express()
const port = process.env.PORT || 4444;

//config template engine
configViewEngine(app)

//middleware 
//body req receive data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


// Route
app.get('*', checkUser);
app.use('/', webRoutes);
app.use('/', projectRoute);
app.listen(port, () => {

    console.log(`App listening on port ${port}`)
})