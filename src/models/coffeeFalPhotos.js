const mongoose = require("mongoose")
const Schema = mongoose.Schema

const coffeeFalSchema = new Schema({
   u_id: { type: String, trim: true },
   photos: { type: Array },
   yorum: { type: String, default: null }
},{timestamps:true})

const coffeeFalModel = mongoose.model("coffeeFal", coffeeFalSchema)
module.exports = coffeeFalModel