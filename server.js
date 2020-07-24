

const express = require("express");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const db = require ("./db.js");
const s3 = require ("./s3.js")
const app = express();
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});



app.get("/api/v1/images", (request,response) => {

    db.getImages()
        .then(images => {
            response.json(images);
        });            
});

app.post("/upload", uploader.single("file"), (request,response) => {

    const s3imageURL = s3.generateBucketURL(request.file.filename);
    
//     // s3.uploadFile(request.file).then(result => {
//     //     console.log("s3 upload result", result);
//     // });

     response.json({
         success: true,
         fileURL: "/uploads/" + request.file.filename,
     });

});

app.listen(8080);
