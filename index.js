const express = require('express')
const aws = require('aws-sdk')
var bodyParser = require("body-parser")

const app = express()

const PORT = process.env.PORT || 3456

app.use(bodyParser.json({limit: '5mb'}))

app.get("/sign-s3", (req, res) => {
  const s3 = new aws.s3()
  // const fileName = req.query['file-name']
  // const fileType = req.query['file-type']
  const s3Params = {
    Bucket: "image-dev.edji.it",
    Key: "test-file",
    Expires: 60,
    ContentType: "image/jpeg",
    // ContentType: fileType,
    ACL: "public-read"
  }

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send()
    }

    let returnData = {
      signedRequest: data,
      url: `//${S3_BUCKET}.s3-website-us-west-2.amazonaws.com`
    }

    res.status(200).send(returnData)
  })

})

app.listen(PORT, () => {
  console.log("Grapple listening on " + PORT)
})

const S3_BUCKET = process.env.S3_BUCKET || "image.edji.it"