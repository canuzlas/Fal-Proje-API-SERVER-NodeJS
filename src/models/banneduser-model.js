const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bannedUserSchema = new Schema({
    mail: { type: String, trim: true },
}, { timestamps: true })

const bannedUserModel = mongoose.model("banneduser", bannedUserSchema)

module.exports = bannedUserModel 