const router = require('express').Router();
let User = require('../models/user.model');
let Project = require('../models/project.model');

router.route('/').get((req, res) => {
    User.find()
    .then(users => {
        let userArr = []

        users.map(user => {
            userArr.push({
                username: user.username,
                _id: user._id
            })
        });
        res.json({ status: true, users: userArr });
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
    .then(user => res.json({ status: true, user: user }))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/delete/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then(deletedUser => {
        User.find()
        .then(users => {
            if(users.length > 0) {
                Project.find()
                .then(projects => {
                    for(let i = 0; i < projects.length; i++) {
                        for(let j = 0; j < projects[i].tasks.length; j++) {
                            if(projects[i].tasks[j].username == deletedUser.username){
                                projects[i].tasks[j].username = users[users.length-1].username;
                            }
                        }
                        projects[i].save();
                    }
                });
                res.json({ status: true });
            }
            else{
                res.json({ status: false });
            }
        })
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;