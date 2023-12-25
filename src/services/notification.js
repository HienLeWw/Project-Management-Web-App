const User = require('../models/Users')
const Project = require('../models/Projects')
const Task = require('../models/Tasks')

const compareDay = (date1, date2) => {
    let d1 = date1
    let d2 = date2

    d1.setHours(0, 0, 0, 0)
    d2.setHours(0, 0, 0, 0)
    return (d1 - d2) // == 0 => d1 == d2; < 0 => d1 < d2; > 0 => d1 > d2
}
const updateNoti = async () => {
    const projects = await Project.find()
    for (let i = 0; i < projects.length; i++) {
        let noti = [];
        for (let j = 0; j < projects[i].task.length; j++) {
            const task = await Task.findById(projecs[i].task[j]);
            const currentDay = new Date();
            // nếu true : currentDay = end_date - 1
            if (await compareDay(currentDay, new Date(task.end_date)) == 0) {

                // chua hoan thanh
                if (task.status != 2) {
                    var infoNoti = {
                        "endDate": task.end_date,
                        "taskName": task.name,
                        "taskID": task._id
                    };
                    noti.push(infoNoti)
                }
            }
        }
        projects[i].notification = noti;
        await projects[i].save();
    }
}

module.exports = { updateNoti }