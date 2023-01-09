require("dotenv").config()

const express = require("express")
const app = express()
var cors = require('cors')

app.use(cors())

const router = require('./api');
app.use('/api', router);

module.exports = app;
