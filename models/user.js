const mongoose = require('mongoose')

const userschema = mongoose.Schema({
    first_name: String,
    last_name: String,
    data: String,
    email: String,
    password: String
})

const usermodel = mongoose.model('user', userschema)

module.exports = usermodel