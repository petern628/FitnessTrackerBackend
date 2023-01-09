require("dotenv").config()

const express = require("express")
const app = express()
app.use(express.json())

var cors = require('cors')
app.use(cors())

const router = require('./api');
app.use('/api', router);

module.exports = app;
