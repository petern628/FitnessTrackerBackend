require("dotenv").config()

const express = require("express")
const app = express()
const cors = require('cors')

// Setup your Middleware and API Router here

app.use(express.json())

app.use(cors())

const router = require('./api');
app.use('/api', router);

app.get((req, res, next) => {
    res.status(404);

    next({
        name: '404 - Not Found',
        message: 'No route found for the requested URL',
    });
});

app.use((error, req, res, next) => {
    console.error('SERVER ERROR: ', error);
    if (res.statusCode < 400) res.status(500);
    console.log({
        error: error.message,
        name: error.name,
        message: error.message,
        table: error.table,
    });
    res.send({
        error: error.message,
        name: error.name,
        message: error.message,
        table: error.table,
    });
});

module.exports = app;