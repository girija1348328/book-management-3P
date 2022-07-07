const userModel = require("../models/userModel")
const validator = require("../validator/validate")
const jwt = require("jsonwebtoken");



const createUser = async function (req, res) {
    try {
        let data = req.body
        //title
        if (!data.title) return res.status(400).send({ status: false, message: "title is required" });

        if (!validator.isValidTitle(data.title)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters in the title, It should be Mr, Mrs, Miss" })
        }

        //name
        if (!data.name) return res.status(400).send({ status: false, message: "Name is required" });
        if (!validator.regexSpaceChar(data.name)) return res.status(400).send({ status: false, message: " enter Name is in valid format" });

        //phoneNum
        if (!data.phone) return res.status(400).send({ status: false, message: "phone-number is required" });
        if (!validator.moblieRegex(data.phone)) return res.status(400).send({ status: false, message: "please provide the mobile number in a valid format..." })


        //email
        if (!data.email) return res.status(400).send({ status: false, message: "email is required" });
        if (!validator.isValidEmail(data.email)) return res.status(400).send({ status: false, message: `this mail is not valid ::${email}` }) //template literal
        const find = await userModel.findOne({ email: data.email })
        if (find) res.status(404).send({ status: false, message: "This email already exists" })

        //password
        if (!data.password) return res.status(400).send({ status: false, message: "password is required" });
        if (!validator.isValidPassword(data.password)) return res.status(400).send({ status: false, message: `Password should be 8 to 15 characters which contain at least one numeric digit, one uppercase and one lowercase letter` })

        //address
        if (!(data.address.street)) return res.status(400).send({ status: false, message: "address is required" });
        if (!validator.isREgexName(data.address.city)) return res.status(400).send({ status: false, message: "enter city name in valid format" });
        if (!/^\d{6}$/.test(data.address.pincode))
            return res.status(400).send({ status: false, message: "only number is accepted in pincode " });


        const CreatedData = await userModel.create(data)
        res.status(201).send({ msg: CreatedData })
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

const logIn = async function (req, res) {
    try {
        let userName = req.body.email;
        let password = req.body.password;
    
        let user = await userModel.findOne({ email: userName, password: password });
        
        // if(!userName.password == 0) return res.status(404).send({status: false, msg: "Please enter details"})   // changed by fazan
    
        if (!user)
            return res.status(404).send({
                status: false,
                msg: "username or the password is not correct",
            });

        //after successfully creation of login jwt token will be created

        let token = jwt.sign(
            {
                userId: user._id.toString(),
                batch: "Radon",
                organisation: "FunctionUp",
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60,
            },
            "Book-Management"
        );
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, message: "Login successful", token: token });
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }



}




module.exports.logIn = logIn
module.exports.createUser = createUser