const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")
const middleware = require("../middleware/auth")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

 router.post("/register", userController.createUser)
 router.post("/login", userController.logIn)

 router.post("/books", middleware.authentication, bookController.createBook) 
router.get("/books", middleware.authentication,bookController.getBooks)

router.get("/books/:bookId",middleware.authentication,middleware.authorise,bookController.getBooksById)
 router.put("/books/:bookId",middleware.authentication,middleware.authorise,bookController.updateBookByParam)
router.delete("/books/:bookId",middleware.authentication,middleware.authorise,bookController.deleteBookByParam)

module.exports = router;