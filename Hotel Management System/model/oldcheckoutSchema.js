const mongoose = require("mongoose")

const oldcheckoutSchema = new mongoose.Schema({
    checkinid: { type: Number},
    cname: {type:String,required: true},
    contact: {type:String,required: true},
    checkInDate: {type:String,required: true},
    checkOutDate: {type:String,required: true},
    roomNo: {type:String,required: true},
    total: {type:String,required: true},
    status:{type:String},
    invoice:{type:String},
    issuedate:{type:String},
    noofdays:{type:String},
})
oldcheckoutSchema.pre('save', async function(next) {
    try {
        // Check if checkinid is not already assigned
        if (!this.checkinid) {
            const Checkin = oldcheckout.model('oldcheckout', oldcheckoutSchema);

            // Find the highest checkinid in the collection
            const highestRoom = await oldcheckout.findOne({}, { checkinid: 1 }, { sort: { checkinid: -1 } });

            // Set the new checkinid to be one greater than the highest existing checkinid
            this.checkinid = (highestRoom && highestRoom.checkinid ? parseInt(highestRoom.checkinid) + 1 : 1).toString();
        }
        next();
    } catch (err) {
        next(err);
    }
});
const oldcheckout = mongoose.model("oldcheckout",oldcheckoutSchema)

module.exports = oldcheckout