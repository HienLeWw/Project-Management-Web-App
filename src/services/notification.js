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

const getNotification = async (user, project) => {

    let noti = [];
    for (let i = 0; i < project.task.length; i++) {
        const task = await Task.findById(project.task[i]);
        console.log(task)
        if (task.user_ids.indexOf(user.id) >= 0) {
            const currentDay = new Date();
            // nếu true : currentDay = end_date - 1
            if (await compareDay(currentDay, new Date(task.end_date)) == 0) {

                // chua hoan thanh
                if (task.status != 2) {
                    var infoNoti = {
                        "endDate": task.end_date,
                        "taskName": task.name
                    };
                    noti.push(infoNoti)
                }
            }
        }
    }
    console.log(noti)
    return noti;
}

module.exports = { getNotification }