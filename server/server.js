const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: ['https://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));

app.use(express.json());

const uri = process.env.URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB connection established');
});

const userRouter = require('./routes/users');
const projectRouter = require('./routes/projects');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

const TOKEN_KEY = process.env.TOKEN_KEY;

app.use('/:token', (req, res, next) => {
    if (req.params.token == 'login' || req.params.token == 'register') {
        next();
    }
    else {
        jwt.verify(req.params.token, TOKEN_KEY, (err, data) => {
            if (err) {
                res.json({ status: false });
            }
            else {
                next();
            }
        });
    }
});
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/:token/user', userRouter);
app.use('/:token/project', projectRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});