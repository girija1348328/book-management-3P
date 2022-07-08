const bookModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")

const validator = require("../validator/validate")
const createReview = async function (req, res){
    try{
        let requestBody = req.body
        if (!validator.isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: "Please, provide book details to create book...!" })
        

        let saveReview = await reviewModel.create(bookdata);
        return res.status(201).send({ status: true, message: "Success", data: saveReview })

    }
    catch(err){
        return res.status(500).send({ status: false, message: err.message }); }
    
}

module.exports.createReview = createReview