const bookModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")
const validator = require("../validator/validate")




//Create Review
const createReview = async function (req, res) {
    try {
        let requestBody = req.body
        let bookId = req.params.bookId
        let { reviewedBy, rating, review } = requestBody

        if (!validator.isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: "Please, provide book details to create book...!" })

        if (bookId == undefined) return res.status(400).send({ status: false, message: "Please, provide bookId...!" })
        if (!validator.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please,enter valid bookId....!" })




        //bookId
        let checkBook = await bookModel.findById({ _id: bookId, isDeleted: false });
        if (!checkBook) return res.status(404).send({ status: false, message: "No such book found...!" })

        //reviewBy
        if (!validator.valid(reviewedBy) || !validator.regexSpaceChar(reviewedBy)) return res.status(400).send({ status: false, message: "reviewedBy name is not valid format...!" });

        //rating
        if (!Number.isInteger(rating)) return res.status(400).send({ status: false, message: "rating should be integer" })
        if (!(/[1-5]/.test(rating))) return res.status(400).send({ status: false, message: "rating should be 1-5" })

        if (!validator.valid(review) || !validator.regexSpaceChar(review)) return res.status(400).send({ status: false, message: "review name is not valid format...!" });



        const reviewedData = { bookId, reviewedBy, reviewedAt: new Date(), rating, review }

        //review
        if (review == undefined)
            delete reviewedData.review

        let saveReview = await reviewModel.create(reviewedData)
        let obj = saveReview.toObject();
        delete obj.isDeleted;
        delete obj.__v;

        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } })
        return res.status(201).send({ status: true, message: "Review created successfully", data: obj })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }

}



const updateReview = async function (req, res) {
    try {

        if (req.params.bookId == undefined) return res.status(400).send({ status: false, message: "bookId is required in params...!" })
        let bookId = req.params.bookId;
        if (!validator.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter valid bookId...!" })
        const bookExist = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ deletedAt: 0 })
        if (!bookExist) return res.status(404).send({ status: false, message: "No such book found...!" });



        if (req.params.reviewId == undefined) return res.status(400).send({ status: false, message: "reviewId is required...!" })
        let reviewId = req.params.reviewId;
        if (!validator.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "enter valid reviewId...!" })
        const reviewExist = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })
        if (!reviewExist) return res.status(400).send({ status: false, message: "review not found...!" })



        if (bookId != reviewExist.bookId) return res.status(400).send({ status: false, message: "review is not of this book...!" })


        if (!validator.isValidRequestBody(req.body)) return res.status(400).send({ status: false, message: "data in request is required...!" })

        let requestBody = req.body;

        // Update the review - review, rating, reviewer's name.
        let { review, rating, reviewedBy } = requestBody;

        if (!validator.regexSpaceChar(reviewedBy)) return res.status(400).send({ status: false, message: "reviewedBy name is not valid format...!" });

        if (!Number.isInteger(rating)) return res.status(400).send({ status: false, message: "rating rating should be integer" })
        if (!(/[1-5]/.test(rating))) return res.status(400).send({ status: false, message: "rating should be 1-5" })

        if (!validator.regexSpaceChar(review)) return res.status(400).send({ status: false, message: "review name is not valid format...!" });



        let updatedReview = await reviewModel.findOneAndUpdate(reviewId, requestBody, { new: true })


        return res.status(200).send({ status: true, message: "Updated Successfully", data: updatedReview })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const deleteBookByParam = async function (req, res) {
    try {
        //bookId from Params
        let bookId = req.params.bookId;
        if (req.params.bookId == undefined) return res.status(400).send({ status: false, message: "bookId is required in params...!" })
        if (!validator.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter valid bookId...!" })
        const bookExist = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ deletedAt: 0 })
        if (!bookExist) return res.status(404).send({ status: false, message: "No such book found...!" });

        //reviewId from params
        let reviewId = req.params.reviewId;
        if (req.params.reviewId == undefined) return res.status(400).send({ status: false, message: "reviewId is required...!" })
        if (!validator.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "enter valid reviewId...!" })
        const reviewExist = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!reviewExist) return res.status(404).send({ status: false, message: "review not found...!" })

        //DB call
        let checkReview = await reviewModel.findById({ _id: reviewId })
        if (!checkReview) return res.status(404).send({ status: false, data: "no such type of review exist...! " })
        if (checkReview.isDeleted == true) return res.status(400).send({ status: false, data: "review is already deleted...!" })
        if (checkReview.isDeleted == false) {   //condition wants to excecute

            await reviewModel.findOneAndUpdate(
                { _id: reviewId },
                { $set: { isDeleted: true } },
                { new: true }
            );
            await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } })
            return res.status(200).send({ status: true, message: "deleted succesfully...!" })

        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }

}



module.exports = { createReview, updateReview, deleteBookByParam }
