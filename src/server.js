require('dotenv').config()
const express = require('express')
const configViewEngine = require('./config/viewEngine')
const schedule = require('node-schedule');
const cookieParser = require('cookie-parser')

const webRoutes = require('./routes/web');
const projectRoute = require('./routes/project')
const taskRoute = require('./routes/Task')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
const { updateNoti } = require('./services/notification')
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
app.use('*', checkUser);
app.use('/', webRoutes);
app.use('/', projectRoute);
app.use('/', taskRoute);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
//schedule.scheduleJob({ hour: 0, minute: 0 }, async () => updateNoti())
var cronExpress = '0 */1 * * * *'
schedule.scheduleJob(cronExpress, updateNoti)