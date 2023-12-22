const express = require('express')
const router = express.Router()

const { getTaskPage, TaskCreate, ModTaskContent, getTask, deleteTask } = require('../controllers/TaskController')

router.get("/Projects/task.html", getTaskPage)
router.post("/Projects/Tasks/Creation", TaskCreate)
router.get("/Projects/Tasks/", getTask)
router.post("/Projects/Tasks/Content", ModTaskContent)
router.post("/Projects/Tasks/Delete", deleteTask)

module.exports = router