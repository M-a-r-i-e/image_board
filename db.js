
const spicedPG = require("spiced-pg");

const db = spicedPG(process.env.DATABASE_URL || "postgres:Marie1:@localhost:5432/imageboard");

exports.getImages = () => {

    return db
        .query("SELECT * FROM images ORDER BY created_at DESC;")
        .then((result) => {
        return result.rows;
    });
    
};

exports.addImage = (url, username, title, description) => {
    return db.query(`
    INSERT INTO images(url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *;`, [url, username, title, description]);
};

exports.getImage = (imageId) => {
    return db.query("SELECT * FROM images WHERE id = $1;", [imageId]).then((result)=> {
        return result.rows[0];
    });
}

// return comments for selected image
exports.getAllComments = (imageId) => {
    return db.query("SELECT * FROM comments WHERE image_id = $1;", [imageId]).then((result) =>{
        return result.rows;
    });
};

//stores comments in the db
exports.addComment = (imageId, username, comment_text) => {
    return db.query(`INSERT INTO comments(image_id, username, comment_text) VALUES ($1, $2, $3) RETURNING *;`, [imageId, username, comment_text]).then(result => result.rows[0]);
};