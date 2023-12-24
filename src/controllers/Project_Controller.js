const { underscore } = require('consolidate');
const { db } = require('../config/database');
const Project = require('../models/Projects');
const User = require('../models/Users');
const Task = require('../models/Tasks')
const mongoose = require('mongoose');

const errorHandler = (req, err) => {
    console.log(err.message, err.code);
    var id_admin = req.user.id

    // Project Name Duplicated
    try {
        if (err.code === 11000) {
            if (err.message.includes('name')) {

                for (let i = 0; i < 999; i++) {
                    let new_ProjName = '$(Project.name)$(i)';
                    let existed_Project = (Project.findOne({ name: new_ProjName, admin: id_admin }));
                    if (!existed_Project)
                        Project.name = new_ProjName;
                    break;
                }

            }
        }
    } catch (error) {
        let errors = { name: 'Duplicated Project Name, cannot handle!' };
        return errors;
    }
}

const Delete_Project = (req, res) => {
    const id_admin = req.user.id;

    const Project_name = req.body.name;

    Project_to_delete = Project.deleteOne({ name: Project_name, admin: id_admin }, function (err) {
        if (err) throw err;
        console.log("Project deleted");
    });

}


const Create_Project = async (req, res) => {
    const admin = req.user.id;
    console.log(admin);
    const Project_name = req.body.name;
    const task = [];

    try {
        //create project and add project to owner
        const project = await Project.create({ "name": Project_name, admin, task });
        const user = await User.findById(req.user.id);
        user['project_ID'].push(project['_id']);
        await user.save();
        res.status(201).json(project);
    }
    catch (err) {
        errors = errorHandler(req, err);
        console.log("Cannot create project!!!!");
        res.status(400).json({ errors });
    }
}

const getProjects = async (req, res) => {
    const Project_list = [];
    for (let i = 0; i < res.locals.user.project_ID.length; i++) {
        const project = await Project.findById(res.locals.user.project_ID[i])
        Project_list.push(project);
    }
    res.status(200).json({ "project_list": Project_list })
}

const projectPage = async (req, res) => {
    console.log("datoihamnay")
    const project = await Project.findById(req.query.id)
    res.render('home.ejs', { "project": project })
}

const memberPage = async (req, res) => {
    res.render('member.ejs')
}

const calendarPage = async (req, res) => {
    res.render('calendar.ejs')
}

const getAllInfo = async (req, res) => {
    const users = await User.find({ 'project_ID': req.query.id })
    const project = await Project.findById(req.query.id);
    console.log("test", project['task'][0])
    const taskList = []
    for (let i = 0; i < project['task'].length; i++) {
        const task = await Task.findById(project['task'][0]);
        taskList.push(task);
    }

    res.status(200).json({ "users": users, "tasks": taskList })
}
const modProject = async (req, res) => {
    try {
        for (let i = 0; i < req.body.username.length; i++) {
            const user = await User.find({ 'username': req.body.username[i] });
            console.log(user[0]['project_ID'])

            user[i]['project_ID'].push(req.query.id);
            await user[i].save();
        }
        res.status(201).json({ "user": user })
    }
    catch (err) {
        res.status(400).json({ "error": err.message })
    }
}

module.exports = { Create_Project, Delete_Project, getProjects, projectPage, memberPage, getAllInfo, calendarPage, modProject };