const { createSecretToken } = require('../util/SecretToken');
const router = require('express').Router();
const User = require('../models/user.model');

router.route('/').post((req, res) => {
    const { username, password } = req.body;
    User.findOne({ username })
    .then(user => {
        if(user) {
            res.json({ exists: true });
        }
        else{
            User.create({ username, password })
            .then(newUser => {
                const token = createSecretToken(newUser._id);
                res.json({ token: token, status: true, exists: false });
            })
            .catch(err => res.status(400).json('Error: ' + err));
        }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;