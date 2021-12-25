const mongoose = require("mongoose")
const Schema = mongoose.Schema

const falSchema = new Schema({
   u_id: { type: String, trim: true },
   photos: { type: Array,default:null },
   yorum: { type: String, default: null },
   cards: { type: Array, default: null },
   type: { type: String },
}, { timestamps: true })

const falModel = mongoose.model("coffeeFal", falSchema)
module.exports = falModel