const db = require('../config/database')
const mongoose = require('mongoose')
const User = require('../models/Users');
const Project = require('../models/Projects');
const Task = require('../models/Tasks')

const errorHandler = (req, err) => {
    //handle sth
    errors = [err]
    return errors
}

const getTaskPage = (req, res) => {
    res.status(200)
}

const TaskCreate = async (req, res) => {
    //tạo 1 task

    var name = req.body.name;
    var content = req.body.content;
    var master_project = req.body.master_project;
    var created_date = new Date();
    var status = 0; // mặc định để to do
    var end_date = req.body.end_date;
    var user_ids = req.body.user_ids;

    try {
        const task = await Task.create({ "name": name, "user_ids": user_ids, 
                    "master_project": master_project, "status": status, "content": content,
                    "created_date": created_date, "end_date": end_date });
        res.status(201).json(task);
    }
    catch(err){
        errors = errorHandler(req, err)
        res.status(400).json({errors})
    }

}

const ModTaskContent = (req, res) => {
    const task_to_mod = req.body.name;
    const master_project = req.body.master_project;
    const new_content = req.body.content;
    const new_end_date = req.body.end_date;
    const update_user_ids = req.body.user_ids;
    try {
        update_content = Task.updateOne(
            {"name": task_to_mod}, 
            {
                $set: { 'content': new_content, 'end_date': new_end_date, 'user_ids': update_user_ids}
            }
        )
        console.log("Modify OK!");
        res.status(201).send('Modify OK!')

    } catch (err) {
        res.status(401).json(err);
        throw err;
    }
    
} 

const getTask = (req, res) => {
    
    res.status(200)
} 

const deleteTask = (req, res) => {
    res.status(200)
}

module.exports = { getTaskPage, TaskCreate, ModTaskContent, getTask, deleteTask };