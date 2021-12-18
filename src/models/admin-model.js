const mongoose = require("mongoose")
const Schema = mongoose.Schema

const adminSchema = new Schema({
   username: { type: String, min: 2, trim: true },
   mail: { type: String, min: 8, max: 60, trim: true },
   pass: { type: String, min: 8, max: 32, trim: true }
}, { timestamps: true })

const adminModel = mongoose.model("admin", adminSchema)

module.exports = adminModel