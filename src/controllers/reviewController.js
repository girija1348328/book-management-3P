const bookModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")
const validator = require("../validator/validate")
const createReview = async function (req, res){
    try{
        let requestBody = req.body
        let bookId = req.params.bookId
        let{reviewedBy, rating, review,reviewedAt} = requestBody
       
        if (!validator.isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: "Please, provide book details to create book...!" })

        if (!validator.valid(bookId)) return res.status(400).send({ status: false, message: "Please, provide bookId...!" })
        if (!validator.isValidObjectId (bookId)) return res.status(400).send({ status: false, message: "Please,enter valid bookId....!" })
        



        //bookId
        let checkBook = await bookModel.findById({ _id: bookId, isDeleted: false });
        if (!checkBook) return res.status(404).send({ status: false, message: "No such book found...!" })

        //reviewBy
        if (!validator.valid(reviewedBy) || !validator.regexSpaceChar(reviewedBy)) return res.status(400).send({ status: false, message: "reviewedBy name is not valid format...!" });
        
        //rating
        if(!Number.isInteger(rating))return res.status(400).send({ status: false, message: "rating rating should be integer" })
        if(!(/[1-5]/.test(rating)))return res.status(400).send({ status: false, message: "rating should be 1-5" })

        if (!validator.valid(review) || !validator.regexSpaceChar(review)) return res.status(400).send({ status: false, message: "review name is not valid format...!" });

       
        // if (!validator.valid(reviewedAt)) return res.status(400).send({ status: false, message: "reviewedAt is required...!" })
        // if (!moment.utc(reviewedAt, "YYYY-MM-DD", true).isValid()) return res.status(400).send({ status: false, message: "enter date in valid format eg. (YYYY-MM-DD)...!" })
        const reviewedData =  {bookId,reviewedBy,reviewedAt:new Date(), rating,review}

        //review
        if(review == undefined)
        delete reviewedData.review

        let saveReview = await reviewModel.create(reviewedData)//.select({__v:0})
        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false },{$inc:{reviews:1}})
        return res.status(201).send({ status: true, message: "Review created successfully", data: saveReview })

    }
    catch(err){
        return res.status(500).send({ status: false, message: err.message }); }
    
}

const updateReview = async function(req,res){
    try{
       
        if(req.params.bookId == undefined) return res.status(400).send({status:false, message:"bookId is required in params...!"})
        let bookId = req.params.bookId;
        if(!validator.isValidObjectId(bookId)) return res.status(400).send({status:false, message:"Please enter valid bookId...!"})
        const bookExist = await bookModel.findOne({_id :bookId, isDeleted:false}).select({deletedAt:0})
        if(!bookExist) return res.status(404).send({status:false, message:"No such book found...!"});



        if(req.params.reviewId == undefined) return res.status(400).send({status:false, message:"reviewId is required...!"})
        let reviewId = req.params.reviewId;
        if(!validator.isValidObjectId(reviewId)) return res.status(400).send({status:false, message:"enter valid reviewId...!"})
        const reviewExist = await reviewModel.findOne({_id:reviewId, isDeleted:false})
        if(!reviewExist) return res.status(400).send({status:false, message:"review not found...!"})



        if(bookId != reviewExist.bookId) return res.status(400).send({status:false, message:"review is not of this book...!"})


        if(!validator.isValidRequestBody(req.body)) return res.status(400).send({status:false, message:"data in request is required...!"})

        let requestBody =req.body;

        // Update the review - review, rating, reviewer's name.
       let {review, rating, reviewedBy} =requestBody;

       if ( !validator.valid(reviewedBy) || !validator.regexSpaceChar(reviewedBy)) return res.status(400).send({ status: false, message: "reviewedBy name is not valid format...!" });

       if(!Number.isInteger(rating))return res.status(400).send({ status: false, message: "rating rating should be integer" })
        if(!(/[1-5]/.test(rating)))return res.status(400).send({ status: false, message: "rating should be 1-5" })

      if (!validator.valid(review) ||!validator.regexSpaceChar(review)) return res.status(400).send({ status: false, message: "review name is not valid format...!" });

     

       let updatedReview = await reviewModel.findOneAndUpdate(reviewId,requestBody,{new:true} )

       return res.status(200).send({status:true, message:"Updated Successfully", data:updatedReview})

    }catch(err){
        return res.status(500).send({ status: false, message: err.message }); }
}




module.exports = {createReview,updateReview}