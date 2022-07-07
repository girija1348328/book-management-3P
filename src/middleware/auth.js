let jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const blogModel = require("../models/blogModel")
let decodedToken;

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId);   // to validate a MongoDB ObjectId we are use .isValid() method on ObjectId
};

/****************************************(Authentication)*****************************************************/
const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"] || req.headers["x-Api-key"];

        if (!token) return res.status(401).send({ status: false, message: "Missing authentication token in request" });

        const decodedToken = jwt.verify(token, "Project3")

        req.decodedToken = decodedToken

        next();

    } catch (error) {
        if (error.message == 'invalid token') return res.status(400).send({ status: false, msg: "invalid token" });

        if (error.message == "jwt expired") return res.status(400).send({ status: false, msg: "Token expired" });

        if (error.message == "invalid signature") return res.status(401).send({ status: false, msg: "invalid signature" });

        return res.status(500).send({ status: false, error: error.message });
    }
};

module.exports = { authentication }