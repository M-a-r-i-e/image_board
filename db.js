
const spicedPG = require("spiced-pg");

const db = spicedPG("postgres:Marie1:@localhost:5432/imageboard");

exports.getImages = () => {
    return db.query('SELECT * FROM images;').then(result => {
        return result.rows;
    });
};