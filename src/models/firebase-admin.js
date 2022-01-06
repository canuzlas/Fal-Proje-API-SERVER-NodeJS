const mongoose = require("mongoose")
const Schema = mongoose.Schema

const firebaseAdminSchema = new Schema({
    mail: { type: String, trim: true },
    pass: { type: String, trim: true },
}, { timestamps: true })

const firebaseAdminModel = mongoose.model("firebase-admin", firebaseAdminSchema)

module.exports = firebaseAdminModel