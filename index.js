const express = require('express')
const uuid = require('uuid')
const aws = require('aws-sdk')
aws.config.update({region: 'us-west-2'}) // update the aws region we're referencing
var bodyParser = require("body-parser")

const app = express()

const PORT = process.env.PORT || 3456
const S3_BUCKET = process.env.S3_BUCKET || "image-dev.edji.it"

app.use(bodyParser.json({limit: '5mb'}))

// Access allowed for development (CORS stuff)
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', '*')
    var oneof = false
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin)
        res.header('Access-Control-Allow-Credentials', true)
        oneof = true
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method'])
        oneof = true
    }

    if (req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'])
        oneof = true
    } 
    // else {
    //     // Request headers you wish to allow
    //     res.header('Access-Control-Allow-Headers', 'authorization, content-type, accept, origin')
    // }

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)

    // Pass to next layer of middleware
    next()
})

app.get("/sign-s3", (req, res) => {
  const s3 = new aws.S3()
  const fileExt = req.query['file-name'].substr(req.query['file-name'].lastIndexOf(".")).toLowerCase()
  const fileName = "readings/" + uuid.v4() + fileExt
  const fileType = req.query['file-type']
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: "public-read"
  }

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send()
    }

    let returnData = {
      signedRequest: data,
      // url: `//${S3_BUCKET}.s3-website-us-west-2.amazonaws.com/${fileName}`
      url: `//${S3_BUCKET}/${fileName}`
    }

    res.status(200).send(returnData)
  })

})

app.listen(PORT, () => {
  console.log("Grapple listening on " + PORT)
})
