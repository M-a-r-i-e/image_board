
const spicedPG = require("spiced-pg");

const db = spicedPG("postgres:Marie1:@localhost:5432/imageboard");

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

exports.getAllComments = (id) => {
    return db.query("SELECT * FROM comments LEFT JOIN images ON id = id;", [id]);
};