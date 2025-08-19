import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: String, ref:"User", required: true},
    workspace: {type: String, ref:"Workspace", required: true},
    office: {type: String, ref:"Office", required: true},
    checkInDate: {type: Date, required: true},
    checkOutDate: {type: Date, required: true},
    totalPrice: {type: Number, required: true},
    guests: {type: Number, required: true},
    status: {type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending"},
    paymentMethod: {type: String, required: true, default: "Pay at location"},
    isPaid: {type: Boolean, default: false}

}, {timestamp: true});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
