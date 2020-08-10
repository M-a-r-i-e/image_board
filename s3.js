
let secrets;
    if (process.env.NODE_ENV == 'production') {
        secrets = process.env; // in prod the secrets are environment variables
    } else {
        secrets = require('./secrets.json'); // in dev they are in secrets.json which is listed in .gitignore
    }                

const aws = require("aws-sdk");

const fs = require ("fs");

//npm install aws-sdk



const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});


exports.uploadFile = (fileFromRequest) => {

    const {filename, mimetype, size, path} = fileFromRequest;

    return s3.putObject({
        Bucket: secrets.AWS_BUCKET_NAME,
        ACL: 'public-read',
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    }).promise()
     .then(response => {
        // return {success :true};
    });
}


exports.generateBucketURL = filename => {
    return `https://s3.amazonaws.com/${secrets.AWS_BUCKET_NAME}/${filename}`;
}