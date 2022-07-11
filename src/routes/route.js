const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")
const reviewController = require("../controllers/reviewController")
const middleware = require("../middleware/auth")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

 router.post("/register", userController.createUser)
 router.post("/login", userController.logIn)

 router.post("/books", middleware.authentication, bookController.createBook) 
router.get("/books", middleware.authentication,bookController.getBooks)

router.get("/books/:bookId",middleware.authentication,bookController.getBooksById)
 router.put("/books/:bookId",middleware.authentication,middleware.authorise,bookController.updateBookByParam)
router.delete("/books/:bookId",middleware.authentication,middleware.authorise,bookController.deleteBookByParam)

router.post("/books/:bookId/review", reviewController.createReview )
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)  
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteBookByParam) 
module.exports = router;