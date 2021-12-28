const mongoose = require("mongoose")
const Schema = mongoose.Schema

const activityLogSchema = new Schema({
    action: { type: String, trim: true },
    who: { type: String, trim: true },
}, { timestamps: true })

const activityLogModel = mongoose.model("activitylog", activityLogSchema)

const saveActivity = async (action, who) => {
    const activity = await new activityLogModel({ action, who })
    activity.save()
}

module.exports = { saveActivity, activityLogModel } 