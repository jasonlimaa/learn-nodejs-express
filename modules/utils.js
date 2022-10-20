const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const {SECRET_KEY, EXPIRES_IN} = require("../configs/constant");

function hashString(data) {
    const salt = bcrypt.genSaltSync(13);
    const hashed = bcrypt.hashSync(data, salt);
    return hashed;
}

function compareDataWithHash(data, hashedString) {
    return bcrypt.compareSync(data, hashedString);
}

function jwtTokenGenerator(payload) {
    // new Date() + (1000*60*60*24*6);
    // "6 days , 6h, 6d, 6 , 50s"
    const {username} = payload;
    return jwt.sign({username}, SECRET_KEY, {
        expiresIn: EXPIRES_IN,
    });
}

function verifyJwtToken(token) {
    try {
        const result = jwt.verify(token, SECRET_KEY);
        if (!result.username) throw {status: 401, message: "please login again"};
        return result;
    } catch (error) {
        throw {status: 401, message: "Login unsuccessful"};
    }
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const day = new Date().getDate();
        const fileAddress = `${__dirname}/../public/uploads/images/${year}/${month}/${day}`;
        require("fs").mkdirSync(fileAddress, {recursive: true});
        callback(null, fileAddress);
    }, filename: (req, file, callback) => {
        const fileType = path.extname(file.originalname);
        callback(null, String(Date.now()) + fileType);
    },
});
const upload = multer({storage});

module.exports = {
    hashString, upload, compareDataWithHash, jwtTokenGenerator, verifyJwtToken,
};
