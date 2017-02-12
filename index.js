const express = require('express')
const aws = require('aws-sdk')
var bodyParser = require("body-parser")

const app = express()

const PORT = process.env.PORT || 3456

app.use(bodyParser.json({limit: '5mb'}))

app.listen(PORT, () => {
  console.log("Grapple listening on " + PORT)
})