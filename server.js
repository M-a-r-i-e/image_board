

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



app.get("/api/v1/images", (request, response) => {

    db.getImages()
        .then((images) => {
            response.json(images)

        })
        // .catch((error) => {
        //     console.log("error:", error);
        //     response.status(404).json({ error: "seite nicht gefunden" });
        // })           
});

app.post("/upload", uploader.single("file"), (request,response) => {

    // const s3imageURL = s3.generateBucketURL(request.file.filename);

     // s3.uploadFile(request.file).then(result => {
     //     console.log("s3 upload result", result);
     // });

     response.json({
         success: true,
         fileURL: "/uploads/" + request.file.filename,
     })
     .catch((error) => {
         response.status(500).json({
             success: false,
             error: error,
         })
     })
});

// add an endpoint that will return one images information
app.get("/api/v1/image/:id", (request, response) => {

    db.getImage(request.params.id)
        .then(imageInfo => {
            response.json(imageInfo);
        }) 
        .catch((error) => {
            console.log("error", error)
            response.status(404).json({error: "seite nicht gefunden"}) //!!!
        })    
});

app.listen(8080);