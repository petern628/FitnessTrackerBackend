/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const bcrypt = require("bcrypt");
const { getUserByUsername, createUser, getUserById, getPublicRoutinesByUser, getAllPublicRoutines, getAllRoutinesByUser } = require('../db');

// POST /api/users/register

usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const _user = await getUserByUsername(username);

        if (_user) {
            next({
                name: 'UserExistsError',
                message: 'A user by that username already exists'
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
            token
        });
    } catch ({ name, message }) {
        next({ name, message })
    }
});

// POST /api/users/login
// × Logs in the user. Requires username and password, and verifies that hashed login password matches the saved hashed password. (59 ms)
// × Logs in the user and returns the user back to us (55 ms)
// × Returns a JSON Web Token. Stores the id and username in the token. (55 ms)
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

        if (user && bcrypt.compare(user.password, password)) {
            // create token & return to user
            const token = jwt.sign({
                id: user.id,
                username
            }, process.env.JWT_SECRET
            );

            res.send({ message: "you're logged in!", user, token });
        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect'
            });
        }
    } catch (error) {
        next(error);
    }
});

