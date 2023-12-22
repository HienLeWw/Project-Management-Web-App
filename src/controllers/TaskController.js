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

const Check_dup_task_create = async (name, master_project) => {
    // kiểm tra trùng project name và trùng tên task khi tạo 
    let task_name = name;
    master_project = new mongoose.Types.ObjectId(master_project);

    let check_task = await Task.find({ "name": task_name });
    let check_Project = await Project.find({ "_id": master_project });
    
    if (check_Project.length > 0){
        if (check_task.length <= 0){
            return;
        }
    }
    
    let err = "Invalid Task name or this project was terminated";
    throw err;
    

}

const getTaskPage = (req, res) => {
    res.status(200)
}

const TaskCreate = async (req, res) => {
    //tạo 1 task

    // những tham số cần thiết để khởi tạo 1 task mới
    let name = req.body.name;
    let content = req.body.content;
    let master_project = new mongoose.Types.ObjectId(req.body.master_project); // id project chứa task này
    let created_date = new Date();
    let status = 0; // mặc định để to do
    let end_date = req.body.end_date; // giả định dữ liệu đã được parse sang 
                                      // kiểu Date trước khi được gửi đi 
    let user_ids = req.body.user_ids;

    try {
        await Check_dup_task_create(name, master_project);
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

    // Các thuộc tính cần thiết
    const task_to_mod = req.body.name;
    const master_project = req.body.master_project;

    // Các thuộc tính có thể được thay đổi
    const new_content = req.body.content;
    const new_end_date = req.body.end_date;
    const update_user_ids = req.body.user_ids;
    
    try {
        update_content = Task.updateOne(
            {"name": task_to_mod, "master_project": master_project}, 
            {
                $set: { 'content': new_content, 'end_date': new_end_date, 'user_ids': update_user_ids}
            }
        )
        console.log("Modify OK!");
        res.status(201).send('Modify OK!')

    } catch (err) {
        errors = errorHandler(req, err)
        res.status(400).json({errors})
    }
    
} 

const getTask = async (req, res) => {
    try {
        task_id = new mongoose.Types.ObjectId(req.body.task); //lấy ID task từ req
        res_task = await Task.find({ "_id": task_id})
        res.status(200).json({res_task});
    } catch (err) {
        errors = errorHandler(req, err)
        res.status(400).json({errors})
    }
} 

const deleteTask = async (req, res) => {
    try {
        task_id = new mongoose.Types.ObjectId(req.body.task); //lấy ID task từ req
        task_to_del = await Task.deleteOne({ "_id": task_id})
        res.status(200).send("task deleted");
    } catch (err) {
        errors = errorHandler(req, err)
        res.status(400).json({errors})
    }
}

module.exports = { getTaskPage, TaskCreate, ModTaskContent, getTask, deleteTask };