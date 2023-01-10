require("dotenv").config()

const express = require("express")
const app = express()
var cors = require('cors')

app.use(cors())

module.exports = app;
