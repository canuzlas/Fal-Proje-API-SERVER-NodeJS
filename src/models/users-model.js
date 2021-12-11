const mongoose = require("mongoose")
const Schema = mongoose.Schema

const usersSchema = new Schema({
    name:{type:String, min:2, trim:true},
    mail:{type:String, min:8, max:60, trim:true},
    pass:{type:String, min:8, max:32, trim:true}
})

const usersModel = mongoose.model("user",usersSchema)

module.exports = usersModel