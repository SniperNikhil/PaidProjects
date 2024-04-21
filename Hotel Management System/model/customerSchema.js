const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema({
    custid: { type: String, required: true, unique: true },
    gender: { type: String, required: true},
    contact: { type: String, required: true },
    name: { type: String, required: true },
    dob: { type: String, required: true },
    dor: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    nationality: { type: String, required: true },
    profftype: { type: String, required: true},
    proofid: { type: String, required: true },
    address: { type: String, required: true }
});

const customers = mongoose.model('customers',customerSchema)

module.exports = customers;