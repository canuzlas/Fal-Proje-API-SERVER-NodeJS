const mongoose = require("mongoose")
const Schema = mongoose.Schema

const falSchema = new Schema({
   u_id: { type: String, trim: true },
   photos: { type: Array, default: null },
   yorum: { type: String, default: null },
   cards: { type: Array, default: null },
   type: { type: String },
   whodidcommit: { type: String, default: null }
}, { timestamps: true })

const falModel = mongoose.model("fal", falSchema)
module.exports = falModel