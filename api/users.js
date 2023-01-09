/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { getUserByUsername, createUser } = require('../db');

// POST /api/users/register

usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const _user = await getUserByUsername(username);

        if (_user) {
            next({
                name: 'UserExistsError',
                message: `${username} already exist`
            });
        }

        const user = await createUser({
            username,
            password,
        });

        const token = jwt.sign({
            id: user.id,
            username
        }, JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({
            message: "thank you for signing up",
            token,
            user
        });
    } catch (error) {
        throw error
    }
});

// POST /api/users/login

usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    // request must have both
    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }

    try {
        const user = await getUserByUsername(username);

        if (user && user.password == password) {
            // create token & return to user
            const token = jwt.sign({
                id: user.id,
                username
            }, process.env.JWT_SECRET
            );

            res.send({ message: "you're logged in!", token });
        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect'
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// GET /api/users/me

// usersRouter.get('/me', async (req, res, next) => {
//     try {
//         const token = window.localStorage.getItem("token");

//         if (token) {
//             const response = await fetch(`${API_URL}/users/me`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`,
//                 },
//             });

//             const { data: user } = await response.json();
//             console.log("hey look it is me: ", user);
//             return user;
//         }
//         return;
//     } catch (error) {
//         console.error(error);
//     }
// };

// GET /api/users/:username/routines

module.exports = usersRouter;