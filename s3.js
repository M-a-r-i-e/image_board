

// const secrets = require("./secrets.json")

const aws = require("aws-sdk");

const fs = require ("fs");

//npm install aws-sdk



// const s3 = aws.S3({
//     accessKeyId:
//     secretAccessKey: 
// });


exports.uploadFile = (fileFromRequest) => {

    const {filename, mimetype, size, path} = fileFromRequest;

    return s3.putObject({

    })
}


exports.generateBucketURL = filename => {
    return 
}