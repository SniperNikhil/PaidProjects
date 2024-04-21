const mongoose = require("mongoose")

const checkinSchema = new mongoose.Schema({
    checkinid: { type: Number, unique: true },
    cname: {type:String,required: true},
    contact: {type:String,required: true},
    category: {type:String,required: true},
    floorNo: {type:String,required: true},
    checkInDate: {type:String,required: true},
    checkOutDate: {type:String,required: true},
    roomNo: {type:String,required: true},
    price: {type:String,required: true},
    total: {type:String,required: true},
    balance: {type:String,required: true},
    advance:{type:String,required:true},
    status:{type:String,default:"active"},
    invoice:{type:String,required:true},
    issuedate:{type:String},
    noofdays:{type:String}
})

checkinSchema.pre('save', async function(next) {
    try {
        // Check if checkinid is not already assigned
        if (!this.checkinid) {
            const Checkin = mongoose.model('checkin', checkinSchema);

            // Find the highest checkinid in the collection
            const highestRoom = await Checkin.findOne({}, { checkinid: 1 }, { sort: { checkinid: -1 } });

            // Set the new checkinid to be one greater than the highest existing checkinid
            this.checkinid = (highestRoom && highestRoom.checkinid ? parseInt(highestRoom.checkinid) + 1 : 1).toString();
        }
        next();
    } catch (err) {
        next(err);
    }
});

const checkin = mongoose.model("checkin",checkinSchema)

module.exports = checkin