const userModel = require("../models/userModel")
const validator = require("../validator/validate")
const jwt = require("jsonwebtoken");


const createUser = async function (req, res) {
    try {
        let data = req.body
        //title
        if (!data.title) return res.status(400).send({ status: false, message: "title is required" });

        //name
        if (!data.name) return res.status(400).send({ status: false, message: "Name is required" });

        //phoneNum
        if (!data.phone) return res.status(400).send({ status: false, message: "phone-number is required" });

        //email
        if (!data.email) return res.status(400).send({ status: false, message: "email is required" });
        if (!validator.isValidEmail(data.email))return res.status(400).send({ msg: `this mail is not valid ::${email}` }) //template literal
        const find = await userModel.findOne({email:data.email}) 
        if(find) res.status(404).send({status:false, msg: "This email already exists"})

        //password
        if (!data.password) return res.status(400).send({ status: false, message: "password is required" });
        if (!validator.isValidPassword(data.password))return res.status(400).send({ msg: `Password should be 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter` })

        //address
        if (!data.address.street) return res.status(400).send({ status: false, message: "address is required" });
    
       
        const CreatedData = await userModel.create(data)
        res.status(201).send({ msg: CreatedData })
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

const logIn = async function (req, res) {
    try{
    let userName = req.body.email;
    let password = req.body.password;

    let user = await userModel.findOne({ email: userName, password: password });
    if (!user)return res.status(404).send({status: false,msg: "username or the password is not correct",});


    //after successfully creation of login jwt token will be created

    let token = jwt.sign(
        {
            userId: user._id.toString(),
            batch: "Radon",
            organisation: "FunctionUp",
        },
        "Book-Management",{expiresIn:"1200s"}
    );
    res.setHeader("x-api-key", token);
    res.status(201).send({ msg: "successfully login", token: token });
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }



}




module.exports.logIn = logIn
module.exports.createUser = createUser