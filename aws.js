const aws = require('aws-sdk')
const S3_BUCKET = process.env.S3_BUCKET || "image-dev.edji.it"

// update the aws region we're referencing
aws.config.update({ region: 'us-west-2' })

// if we are not running in production, then we'll load the keys locally
if (process.env.NODE_ENV !== "production") {
    aws.config.loadFromPath('./.aws-keys.json')
}

const s3 = new aws.S3() // aws.S3 automatically grabs AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from the environment as credentials

module.exports = {
  aws: aws,
  s3: s3,
  S3_BUCKET: S3_BUCKET
}