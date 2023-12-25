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

// ghép 2 mảng lại với nhau và bỏ những trường bị lặp
const mergeArray = (a, b, predicate = (a, b) => a === b) => {
    const c = [...a]; // copy to avoid side effects
    // add all items from B to copy C if they're not already present
    b.forEach((bItem) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
    return c;
}

const Check_dup_task_create = async (name, master_project) => {
    // kiểm tra trùng project name và trùng tên task khi tạo 
    let task_name = name;

    let check_task = await Task.find({ "name": task_name });
    let check_Project = await Project.findById(master_project);

    if (Object.keys(check_Project).length > 0) {
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

const dd_mm_yyyy_formating = (date_string) => {
    let day_struct = date_string.split('/')
    return new Date(day_struct[2], day_struct[1] - 1, day_struct[0])
}

const compare_day = (date1, date2) => {
    let d1 = date1
    let d2 = date2

    d1.setHours(0, 0, 0, 0)
    d2.setHours(0, 0, 0, 0)

    return (d1 - d2) // == 0 => d1 == d2; < 0 => d1 < d2; > 0 => d1 > d2
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
    
    // let master_project = new mongoose.Types.ObjectId(req.body.master_project); // id project chứa task này

    let master_project = req.query.id; // id project chứa task này
    
    
    let end_date = dd_mm_yyyy_formating(req.body.end_date); // giả định dữ liệu đã được parse sang 
                                            // kiểu Date trước khi được gửi đi 

    // DONE:
    //  - cần kiểm tra và đổi lại created date thành begin date 
    //  - cần kiểm tra begin date và end date để xác định giá trị khởi tạo cho status 

    // mặc định để In progress, begin date == created date
    let begin_date = new Date()
    var status = 1

    // TO DO:
    //  - Viết thành 1 hàm riêng
    //  - Kiểm lỗi
    try {
        begin_date = dd_mm_yyyy_formating(req.body.create_date);
        let current_Date = new Date()
        
        // current date < begin => 0: To Do
        // begin <= current date < end date => 1: In progress
        // current date >= end date và chưa xong => 3: Due to
        let time_to_begin = compare_day(current_Date, begin_date);
        let time_to_end = compare_day(end_date, current_Date);

        if (time_to_begin < 0){
            status = 0  // current date < begin => 0: To Do
        } else if (time_to_end <= 0) {
            status = 3 // current date >= end date và chưa xong => 3: Due to
        } else {
            status = 1 // begin <= current date < end date => 1: In progress
        }
    }
    catch (err) {
        // default case
        console.warn("enable to receive or process begining date, using default setting"); 
    }

    let user_ids = req.body.user_ids;

    try {
        console.log(master_project)
        await Check_dup_task_create(name, master_project);
        const task = await Task.create({
            "name": name, "user_ids": user_ids,
            "master_project": master_project, "status": status, "content": content,
            "begin_date": begin_date, "end_date": end_date
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

    // đề phòng gửi mảng user_ids rỗng
    const added_user_ids = req.body.user_ids;
    const task_user_ids = await Task.findById(task_to_mod).user_ids;
    const update_user_ids = mergeArray(task_user_ids, added_user_ids);

    // TO DO:
    // - status cần được cập nhật theo begin date, end date và current date sau khi đc được đưa lên db
    // - người dùng chỉ có thể thay đổi trực tiếp status để đánh dấu công việc đã xong hay chưa?:
    //      + người dùng gửi giá trị done = 0 => status giữ nguyên 
    //      + người dùng gửi giá trị done = 1 => status = 2 (done)
    // - mọi thay đổi khác liên quan đến status phải thực hiện gián tiếp thông qua thay đổi ngày
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
        // nhớ gọi đến notification để update
        // await getNotification(user, project)
        console.log("Modify OK!");
        res.status(201).json({ 'message': 'Modify OK!' })

    } catch (err) {
        errors = errorHandler(req, err)
        res.status(400).json({ errors })
    }

}

const getTask = async (req, res) => {
    try {
        let task_query = await url.parse(req.url, true)
        task_id = new mongoose.Types.ObjectId(task_query.query.task); //lấy ID task từ query

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

module.exports = { getTaskPage, TaskCreate, ModTaskContent, getTask, deleteTask, Check_Task_exist };