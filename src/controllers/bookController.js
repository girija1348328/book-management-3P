const moment = require('moment')
const bookModel = require("../models/bookModel");
const { off } = require("../models/reviewModel");
const userModel = require("../models/userModel");
const validator = require("../validator/validate")

const createBook = async function (req, res) {
    try {
        let requestBody = req.body
        let { title, excerpt, ISBN, category, reviews, subcategory, releasedAt, userId, isDeleted } = requestBody;


        if (!validator.isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: "Please, provide book details to create book...!" })

        if (!validator.valid(title) ||!validator.regexSpaceChar(title) ) return res.status(400).send({ status: false, message: "book title is required in valid format...!" });

        // if()

        let checkTitle = await bookModel.findOne({ title: title });
        // console.log(checkTitle);
        if (checkTitle) return res.status(400).send({ status: false, message: " Book is already exist, Enter new book name...!" })

        if (!validator.valid(excerpt)) return res.status(400).send({ status: false, message: "excerpt is required...!" })

        if (!validator.regexSpaceChar(excerpt)) return res.status(400).send({ status: false, message: "Please enter the proper format excerpt...!" });

        if (!validator.valid(userId)) return res.status(400).send({ status: false, message: "UserId is required...!" })

        if (req.body.hasOwnProperty('userId')) {
            if (!validator.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "please enter the valid UserId...!" })
        }

        let checkUser = await userModel.findById(userId);
        if (!checkUser) return res.status(404).send({ status: false, message: "author is not found" });

        if (!validator.valid(ISBN)) return res.status(400).send({ status: false, message: "ISBN number is required...!" })

        if (!validator.isbnRegex(ISBN)) return res.status(400).send({ status: false, message: "enter the valid isbn number...!" })

        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) return res.status(400).send({ status: false, message: "book with same ISBN is already present...!" })

        if (!validator.valid(category) || !validator.regexSpaceChar(category)) return res.status(400).send({ status: false, message: "category in valid format is required...!" })

        if (!validator.valid(subcategory) || subcategory.length == 0 ) return res.status(400).send({ status: false, message: "Subcategory required in request body...!" })


        if (validator.valid(subcategory)) {
            let temp = subcategory;
            if (typeof (subcategory) == 'object')
                subcategory = temp;
        } else {
            subcategory = temp.split(',').map(string)
        }

        if (validator.valid(reviews))

            if (reviews != '0')
                return res.status(400).send({ status: false, message: "review can't set value other than zero while creating new book...!" })


        if (!validator.valid(releasedAt)) return res.status(400).send({ status: false, message: "releaseeAt is required...!" })

         
        if (!moment.utc(releasedAt, "YYYY-MM-DD",true).isValid()) return res.status(400).send({ status: false, message: "enter date in valid format eg. (YYYY-MM-DD)...!" })

       
        let bookdata = { title, excerpt, ISBN, category, reviews, subcategory, releasedAt, userId, isDeleted };

        let saveBook = await bookModel.create(bookdata);
        return res.status(201).send({ status: true, message: "Success", data: saveBook })


    } catch (err) { return res.status(500).send({ status: false, message: err.message }); }
}

const getBooks = async function (req, res) {
    try {
        let data = req.query
       
        let filter = { isDeleted: false, ...data };
        console.log(filter)  


        if (req.query.hasOwnProperty('userId')) {
            if (!validator.isValidObjectId(req.query.userId)) return res.status(400).send({ status: false, message: "please enter the valid UserId...!" })
     }


        let findBooks = await bookModel.find(filter).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 ,_id:1}).sort({title:1})
        if (!findBooks) return res.status(404).send({ status: false, msg: "No Book found" })
        if (findBooks.length == 0) return res.status(404).send({ status: false, msg: "please enter existing Book" })

        return res.status(200).send({ status: true, message: 'Books list', data: findBooks })

    }
    catch (err) {
        return  res.status(500).send({status: false, msg: err.message })
    }
};





const getBooksById = async function (req, res){

    try {

        let filter = req.params.bookId
        
        
        let checkBookName = await bookModel.findOne({ _id: filter.BookId, isDeleted: false }) /*Check book Name From DB*/
        if (!checkBookName) return res.status(404).send({ status: true, msg: "No such book Name found", });
    
        
        let getReviewData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1 ,rating:1,review:1})
        if (!getReviewData.length) return res.status(404).send({ status: false, msg: "No intern Apply for This College", });
    
        //assign value
        let title = checkBookName.title;
        let excerpt = checkBookName.excerpt;
        let category = checkBookName.category;
        let subcategory = checkBookName.subcategory;
        let isDeleted = checkBookName.isDeleted;
        let reviews = checkBookName.reviews;
        let releasedAt = checkBookName.releasedAt;

        //call value
         let bookData = {
            title: title,
            excerpt: excerpt,
            category: category,
            subcategory:subcategory,
            isDeleted:isDeleted,
            reviews:reviews,
            releasedAt:releasedAt,
            reviewsData: getReviewData
        }
    
        res.status(200).send({ status: true, msg: "Books list", data: bookData });
      } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
      }
    };
    


module.exports = { createBook, getBooks,getBooksById }
//or operator 