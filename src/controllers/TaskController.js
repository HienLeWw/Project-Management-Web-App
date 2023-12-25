const db = require('../config/database')
const mongoose = require('mongoose')
const User = require('../models/Users');
const Project = require('../models/Projects');
const Task = require('../models/Tasks')
const url = require('url')



const errorHandler = (req, err) => {
    //handle sth
    errors = [err]
    return errors
}
const dd_mm_yyyy_formating = (date_string) => {
    let day_struct = date_string.split('/')
    return new Date(day_struct[2], day_struct[1] - 1, day_struct[0])
}
const Check_dup_task_create = async (name, master_project) => {
    // kiểm tra trùng project name và trùng tên task khi tạo 
    let task_name = name;
    master_project = master_project;

    let check_task = await Task.find({ "name": task_name });
    let check_Project = await Project.findById(master_project);

    if (check_Project.length > 0) {
        if (check_task.length <= 0) {
            return;
        }
    }

    let err = "Invalid Task name or this project was terminated";
    throw err;

}

const Check_Task_exist = async (task_id = mongoose.Types.ObjectId) => {
    let task_req = await Task.find({ "_id": task_id });

    if (task_req.length > 0) {
        return;
    }

    let err = "Task not exist";
    throw err;
}

const adminProject = async (taskID, userID) => {
    const task = await Task.findById(taskID);
    const project = await Project.findById(task['master_project'])
    if (project['admin'] == userID) {
        return;
    }
    let err = "you don't have permission to delete Task"
    throw err;
}

const getTaskPage = async (req, res) => {
    try {
        const Task_list = [];
        console.log("ham nay", req.query.id)
        const project = await Project.findById(req.query.id);
        //const proID = list(res.locals.user.project_ID)
        console.log(project, project['task'])
        for (let i = 0; i < project['task'].length; i++) {
            const task = await Task.findById(project['task'][i])
            Task_list.push(task);
        }
        // get members to render
        const users = await User.find({ "project_ID": req.query.id })
        console.log("username", users)
        console.log("task", Task_list)
        res.render("task.ejs", { "Task_list": Task_list, "users": users });
        res.status(200);
    } catch (err) {
        let error = errorHandler(req, err);
        res.status(400).json({ error });
    }
}

const TaskCreate = async (req, res) => {
    //tạo 1 task

    // những tham số cần thiết để khởi tạo 1 task mới
    console.log(req.body)
    let name = req.body.name;
    let content = "";
    //let master_project = new mongoose.Types.ObjectId(req.body.master_project); // id project chứa task này
    let master_project = req.query.id; // id project chứa task này
    let created_date = new Date();
    let status = 0; // mặc định để to do
    let end_date = Date(req.body.end_date); // giả định dữ liệu đã được parse sang 
    // kiểu Date trước khi được gửi đi 
    let user_ids = req.body.user_ids;

    try {
        console.log(master_project)
        await Check_dup_task_create(name, master_project);
        const task = await Task.create({
            "name": name, "user_ids": user_ids,
            "master_project": master_project, "status": status, "content": content,
            "created_date": created_date, "end_date": end_date
        });

        //add task to project
        const project = await Project.findById(req.query.id);
        await project.save()
        res.status(201).json(task);
    }
    catch (err) {
        errors = errorHandler(req, err)
        res.status(400).json({ errors })
    }

}

const ModTaskContent = async (req, res) => {

    // Các thuộc tính cần thiết
    const task_to_mod = req.body.task_to_mod; // lấy task id

    // Các thuộc tính có thể được thay đổi
    const new_content = req.body.new_content;
    const new_end_date =  dd_mm_yyyy_formating(req.body.new_end_date);
    const update_user_ids = req.body.user_ids;
    const update_status = req.body.update_status;
    console.log(req.body);
    try {
        await Check_Task_exist(task_to_mod);
        update_content = await Task.updateOne(
            { "_id": task_to_mod },
            {
                $set: { 'content': new_content, 'end_date': new_end_date, 'user_ids': update_user_ids, 'status': update_status }
            }
        )
        console.log("Modify OK!");
        res.status(201).json({ 'message': 'Modify OK!' })

    } catch (err) {
        errors = errorHandler(req, err)
        console.log(errors);
        res.status(400).json({ errors })
    }

}

const getTask = async (req, res) => {
    try {
        let task_query = await url.parse(req.url, true)
        task_id = new mongoose.Types.ObjectId(task_query.query.task); //lấy ID task từ req

        //console.log(task_id)

        await Check_Task_exist(task_id);
        res_task = await Task.find({ "_id": task_id })
        res.status(200).json({ res_task });
    } catch (err) {
        errors = errorHandler(req, err)
        res.status(400).json({ errors })
    }
}

const deleteTask = async (req, res) => {
    try {
        task_id = new mongoose.Types.ObjectId(req.body.task); //lấy ID task từ req
        console.log("taskid", task_id)
        await Check_Task_exist(task_id);
        await adminProject(req.body.task, req.user._id)
        task_to_del = await Task.deleteOne({ "_id": task_id })
        res.status(200).send("task deleted");
    } catch (err) {
        errors = errorHandler(req, err)
        res.status(400).json({ errors })
    }
}

module.exports = { getTaskPage, TaskCreate, ModTaskContent, getTask, deleteTask };