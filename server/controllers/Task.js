const models = require('../models');
const Task = models.Task;

const makerPage = (req, res) => {
    Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error:'An error occured.' });
        }
        return res.render('app', { csrfToken: req.csrfToken(), tasks: docs });
    });
};


const makeTask = (req, res) => {
    if (!req.body.name || !req.body.priority ) {
        return res.status(400).json({error:'All fields required!'});
    }
    
     const taskData = {
            name: req.body.name,
            priority: req.body.priority,
            icon: req.body.icon,
            owner: req.session.account._id,
     };
    
    const newTask = new Task.TaskModel(taskData);
    
    const taskPromise = newTask.save();
    
    taskPromise.then(() => res.json({ redirect: '/maker'}));
    
    taskPromise.catch((err) => {
            console.log(err);
            if (err.code === 11000) {
                return res.status(400).json({error:'This task already exists!'});
            }
            return res.status(400).json({error:'An error occured.'});
    });
    
    return taskPromise;
};

const getTasks = (request, response) => {
    const req = request;
    const res = response;
    
    return Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occured' });
        }
        return res.json({ tasks: docs });
    });
};



const deleteTask = (selectedID) => {
    //Task.deleteOne({_id: selectedID});
    Task.TaskModel.deleteOne({_id: selectedID});
};



module.exports.makerPage = makerPage;
module.exports.make = makeTask;
module.exports.getTasks = getTasks;
module.exports.deleteTask = deleteTask;
