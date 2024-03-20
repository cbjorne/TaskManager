const { createSecretToken } = require('../util/SecretToken');
const router = require('express').Router();
const User = require('../models/user.model');

router.route('/').post((req, res) => {
    const { username, password } = req.body;
    User.findOne(
        {username: username}
    )
    .then((user) => {
        if(!user) {
            res.json('Incorrect Username/Password');
        }
        else if(user.password == password){
            const token = createSecretToken(user._id);
            res.json({ token: token, status: true });
        }
        else{
            res.json('Incorrect Username/Password');
        }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;