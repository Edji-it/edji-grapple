const im = require('imagemagick')
const fs = require('fs')

let aws = require('./aws')

module.exports = {
    savePdf: function(loc, buff) {
        return new Promise((resolve, reject) => {
            fs.open(loc, 'wx', (err, fd) => {
            if (err) { console.error(err) }
            else {
                // write the req.body (which is a buffer created by body-parser) to the opened file
                fs.write(fd, buff, (err, written, buff) => {
                    if (err) {
                        reject(err)
                    } else {
                        fs.exists(loc, (exists) => {
                            if (exists) {
                                resolve(written, buff)
                            } else {
                                reject("File was not created")
                            }
                        })
                    }
                })
            }
            })
        })
    },
    // recursive function that repeats everything inside until it encounters an error
    convertPage: function(savePath, fileId, pageNum, filePaths, callback) {
        if (!filePaths) { let filePaths = [] } // this will be the returned array of AWS file paths
        let fileName = `${fileId}-${pageNum}.jpg`
        let resultPath = `${savePath}/${fileName}`
        im.convert(['-density', '144', `${savePath}/${fileId}.pdf[${pageNum}]`, resultPath ], (err, stdout) => {
            // when an error occurs, we assume that's because we hit the end of the file, and so we resolve with the created paths
            if (err) {
                fs.unlink(`${savePath}/${fileId}.pdf`, (err) => { /** do nothing */ }) // we'll just let this happen and move on with our lives
                callback(filePaths)
            }
            else {
                pageNum ++ // set up for moving on to the next page
                this.uploadFile(resultPath, fileId, fileName)
                    .then((filePath) => {
                        console.log(filePath)
                        console.log(filePaths)
                        filePaths.push(filePath)
                        this.convertPage(savePath, fileId, pageNum, filePaths, callback)
                    })
            }
        })
    },
    // reads the file, puts it to S3, cleans up the file and resolves with the path to asset in AWS
    uploadFile: function(resultsPath, fileId, fileName) {
        // read the file in, which presumably has the pdf's image
        return new Promise((resolve, reject) => {
            fs.readFile(resultsPath, (err, imgBuff) => {
                if (err) { throw err }
                else { resolve(imgBuff) }
            })
        })
        .then((buff) => {
            // send the image to s3
            // eventually plan on doing better error handling for the PUT call
            return this.putToS3(`pdf/${fileId}/${fileName}`, buff)
        })
        .then((awsPath) => {
            let absolutePath = "//image.edji.it/" + awsPath
            // delete the image on local storage and resolve with the path to the image in AWS
            return new Promise((resolve, reject) => {
                fs.unlink(resultsPath, (err) => {
                    if (err) { throw err }
                    else { resolve(absolutePath) }
                })
            })
        })
    },
    putToS3: function(awsPath, data) {
        return new Promise((resolve, reject) => {
            aws.s3.putObject({
                Bucket: aws.S3_BUCKET,
                Key: awsPath,
                Body: data,
                ACL: 'public-read'
            }, (err, res) => {
                if (err) { throw err }
                else { resolve(awsPath) }
            })
        })
    }
}