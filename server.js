

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

    const s3imageURL = s3.generateBucketURL(request.file.filename);

    s3.uploadFile(request.file)
        .then((response) => {
            const { username, title, description } = request.body;
            return db.addImage(s3imageURL, username, title, description);
        })
        .then((resultFromDb) => {
            const imageInfoFromDB = resultFromDb.rows[0];

            response.json({
                success: true,
                ...imageInfoFromDB,
            });
        })
    
        .catch((error) => {
            console.log("error", error)
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

// return comments of selected image
app.get("/api/v1/comments-image/:imageId",(request, response) => {

    const imageId = request.params.imageId;

    db.getAllComments(imageId)
        .then((comments) => {
            response.json(comments);            
        })
        .catch((error) => {
            response.status(500).send("something went wrong");
            console.log(error);
        })
});


// endpoint that recieves comment and stores it in db

app.post("/api/v1/comments-create", uploader.none(), (request, response) => {

    console.log("body:", request.body)

    const image_id = request.body.image_id;
    const username = request.body.username;
    const comment_text = request.body.comment_text;

    db.addComment(image_id, username, comment_text)

        .then((newComment) => {

            response.json(newComment);
        }
    ).catch(error => {
        console.log("error", error)
        response.json({success: false, error: error});
    })

})

app.listen(process.env.PORT || 8080);