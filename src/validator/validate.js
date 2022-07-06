const mongoose = require('mongoose');

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const valid = function (value) {

    if (typeof (value) === 'undefined' || value === null) return false
   
    if (typeof (value) === "string" && value.trim().length == 0) return false

    return true
}

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId);   // to validate a MongoDB ObjectId we are use .isValid() method on ObjectId
  };


  let isbnRegex = (ISBN) =>{
  return (/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN.trim()) 
  )

}
let isREgexName = function (attribute) {
    return (/^[a-zA-Z]{2,20}$/.test(attribute.trim()))
}

let regexSpaceChar = function (attribute) {
    return (/^[A-Za-z\s]{1,}[\,]{0,1}[A-Za-z\s]{0,}$/.test(attribute.trim()))
}


module.exports ={isValidRequestBody, valid,isbnRegex, isREgexName,regexSpaceChar,isValidObjectId}