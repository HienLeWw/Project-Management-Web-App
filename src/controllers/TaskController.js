const db = require('../config/database')
const mongoose = require('mongoose')
const User = require('../models/Users');
const Project = require('../models/Projects');
const Task = require('../models/Tasks')

const errorHandler = (req, err) => {
    //handle sth
}

const getTaskPage = (req, res) => {

}

const TaskCreate = (req, res) => {
    //tạo 1 task

    var name = req.body.name;
    var content = req.body.content;
    var master_project = req.project.id;
    var created_date = new Date();
    var status = 0; // mặc định để to do
    var end_date = req.body.end_date;
    var user_ids = req.user.id;

    try {
        const task = await Task.create({ "name": name, "user_ids": user_ids, 
                    "master_project": master_project, "status": status, "content": content,
                    "created_date": created_date, "end_date": end_date });
        res.status(201).json(task);
    }
    catch(err){
        errorHandler(req, err)
        res.status(400).json({errors})
    }

}

const ModTaskContent = (req, res) => {
    
} 

const getTask = (req, res) => {

} 

const deleteTask = (req, res) => {

}

module.exports = { getTaskPage, TaskCreate, ModTaskContent, getTask, deleteTask };