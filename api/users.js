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
                message: `User ${username} is already taken.`,
                name: 'UserTakenError'
            });
        }

        if (password.length < 8) {
            next({
                name: 'PasswordTooShortError',
                message: 'Password Too Short!'
            });
        }

        const user = await createUser({
            username,
            password,
        });

        const token = jwt.sign({
            id: user.id,
            username: user.username
        }, JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({
            message: "thank you for signing up",
            token,
            user
        });

    } catch (error) {
        next(error);
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
            }, JWT_SECRET
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

// × sends back users data if valid token is supplied in header (57 ms)
// × rejects requests with no valid token (3 ms)
usersRouter.get('/me', async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    if (!auth) {
        res.statusCode = 401;
        next({
            name: 'UnauthorizedError',
            message: 'You must be logged in to perform this action'
        })
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);

        try {
            const { id } = jwt.verify(token, JWT_SECRET);

            if (id) {
                const user = await getUserById(id);
                res.send(user);
            }
        } catch ({ name, message }) {
            next({ name, message });
        }
    }
});

// × Gets a list of public routines for a particular user. (123 ms)
// × gets a list of all routines for the logged in user (57 ms)
usersRouter.get('/:username/routines', async (req, res, next) => {
    const { username } = req.params;
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    const userPublicRoutines = await getPublicRoutinesByUser({ username });
    res.send(userPublicRoutines);
});

module.exports = usersRouter;