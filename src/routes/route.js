const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

 router.post("/register", userController.createUser)
 router.post("/login", userController.logIn)
 router.post("/books", bookController.createBook)

// router.post("/functionup/interns",internController.createIntern)

// router.get("/functionup/collegeDetails",internController.getInternByCollege)

module.exports = router;