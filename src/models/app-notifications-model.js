const mongoose = require("mongoose")
const Schema = mongoose.Schema

const appNotificationsSchema = new Schema({
    notificationText: { type: String, trim: true },
    notificationType: { type: String, trim: true }
}, { timestamps: true })

const appNotificationModel = mongoose.model("notification", appNotificationsSchema)

module.exports = appNotificationModel