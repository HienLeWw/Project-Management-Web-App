const { db } = require('../config/database');
const Project = require('../models/Projects');
const User = require('../models/Users');
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

    const Project_name = req.body;

    Project_to_detele = Project.deleteOne({ name: Project_name, admin: id_admin }, function (err) {
        if (err) throw err;
        console.log("Project deleted");
    });

}


const Create_Project = async (req, res) => {
    //username = req.cookies.username;
    //id_admin = User.findOne(username)._id;
    const admin = req.user.id;
    console.log(admin);
    const { Project_name } = req.body;
    const task = [];

    try {
        const project = await Project.create({ "name": Project_name, admin, task });
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
    //const proID = list(res.locals.user.project_ID)
    for (let i = 0; i < res.locals.user.project_ID.length; i++) {
        console.log(res.locals.user.project_ID[i])
        const project = await Project.findById(res.locals.user.project_ID[i])
        Project_list.push(project);
    }
    res.status(200).json({ "project_list": Project_list })
}

module.exports = { Create_Project, Delete_Project, getProjects };