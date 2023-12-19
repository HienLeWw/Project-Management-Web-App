const express = require('express')
const router = express.Router()

const { getTaskPage, TaskCreate, ModTaskContent, getTask, deleteTask } = require('../controllers/taskController')

router.get("/Tasks", getTaskPage)
router.post("/Tasks/Creation", TaskCreate)
router.get("/Tasks/Task", getTask)
router.post("/Tasks/Content", ModTaskContent)
router.post("/Tasks/Delete", deleteTask)

module.exports = router