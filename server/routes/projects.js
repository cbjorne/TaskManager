const router = require('express').Router();
let Project = require('../models/project.model');

router.route('/').get((req, res) => {
    Project.find()
    .then(projects => res.json({ status: true, projects: projects }))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/create').post((req, res) => {
    const name = req.body.name;
    const tasks = req.body.tasks;

    Project.findOne({name: name})
    .then(project => {
        if(project) {
            res.json({ status: true, exists: true })
        }
        else{
            const newProject = new Project({
                name,
                tasks
            });
        
            newProject.save()
            .then(() => res.json({ status: true }))
            .catch(err => res.status(400).json('Error: ' + err));
        }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/append').post((req, res) => {
    const task = {
        username: req.body.username,
        name: req.body.task_name,
        description: req.body.description,
        priority: Number(req.body.priority),
        end: Date.parse(req.body.end)
    }
    
    Project.findOneAndUpdate(
        {name: req.body.name},
        {$push: {tasks: task}},
    )
    .then(project => {
        res.json({ status: true, projectid: project._id });
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Project.findById(req.params.id)
    .then(project => res.json({ status: true, project: project }))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Project.findByIdAndDelete(req.params.id)
    .then(() => res.json({ status: true }))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:projectid/get/:taskid').get((req, res) => {
    Project.findById(req.params.projectid)
    .then(project => {
        for(let i = 0; i < project.tasks.length; i++) {
            if(project.tasks[i]._id == req.params.taskid) {
                res.json({ status: true, task: project.tasks[i]});
            }
        }
    })
    .catch(err => res.status(400).json('Project Error: ' + err));
});

router.route('/:projectid/update/:taskid').post((req, res) => {
    Project.findById(req.params.projectid)
    .then(project => {
        for(let i = 0; i < project.tasks.length; i++) {
            if(project.tasks[i]._id == req.params.taskid) {
                project.tasks[i].username = req.body.username;
                project.tasks[i].name = req.body.name;
                project.tasks[i].description = req.body.description;
                project.tasks[i].priority = Number(req.body.priority);
                project.tasks[i].end = Date.parse(req.body.end);

            }
        }
        project.save()
        .then(() => res.json({ status: true }))
        .catch(err => res.status(400).json('Update Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:projectid/delete/:taskid').delete((req, res) => {
    Project.findById(req.params.projectid)
    .then(project => {
        project.tasks.pull({_id: req.params.taskid});

        project.save()
        .then(() => res.json({ status: true }))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Project Error: ' + err));
});

module.exports = router;