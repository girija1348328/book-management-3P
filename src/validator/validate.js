const isValidEmail = function (value) {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(value)) { return true }
    else return false

}

const isValidPassword =function(value){
    if(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(value)){return true}
    else return false
}

module.exports.isValidEmail=isValidEmail
module.exports.isValidPassword=isValidPassword