const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")
const reviewController = require("../controllers/reviewController")




 router.post("/register", userController.createUser)
 router.post("/login", userController.logIn)
 router.post("/books", bookController.createBook)
 router.get("/books", bookController.getBooks)
 router.get("/books/:bookId/review", reviewController.createReview)


module.exports = router;