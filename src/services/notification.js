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
    console.log("running cronjob");
    const tasks = await Task.find({});
    for (let i = 0; i < tasks.length; i++) {
        const currentDay = new Date();
        if (compareDay(currentDay, new Date(tasks[i]['end_date'])) >= 0) {
            console.log(i)
            console.log(tasks[i]._id)
            for (let j = 0; j < tasks[i]['user_ids'].length; j++) {
                const user = await User.findById(tasks[i]['user_ids'][j])
                console.log(tasks[i]['_id'].valueOf())
                if (!user['notification'].find(({ taskID }) => taskID == tasks[i]._id.valueOf())) {
                    noti = {
                        "taskName": tasks[i].name,
                        "taskID": tasks[i]._id.valueOf(),
                        "notiStatus": false,
                        "endDate": tasks[i].end_date,
                        "expiredDay": compareDay(currentDay, new Date(tasks[i]['end_date']))
                    }
                    user['notification'].push(noti)
                    await user.save()
                }
            }
        }

    }
    console.log("done")
    return;
}

module.exports = { updateNoti }