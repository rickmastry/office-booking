import mongoose from "mongoose";

const OfficeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    contact: {type: String, required: true},
    owner: {type: String, required: true, ref: "User"},
    city: {type: String, required: true},

}, {timestamp: true});

const Office = mongoose.model("Office", OfficeSchema)

export default Office