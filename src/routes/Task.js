const express = require('express')
const router = express.Router()

const { getTaskPage, TaskCreate, ModTaskContent, getTask, deleteTask } = require('../controllers/TaskController')

router.get("/Projects/Tasks/task.html", getTaskPage)
router.post("/Projects/Tasks", TaskCreate)
router.get("/Projects/Tasks", getTask)
router.put("/Projects/Tasks", ModTaskContent)
router.post("/Projects/Tasks/Delete", deleteTask)

// "/Projects"
// "/Projects/Project"

module.exports = router