import mongoose from "mongoose";

const PricingSchema = new mongoose.Schema({
  pricePerHour: { type: Number },
  pricePerDay: { type: Number },
  pricePerMonth: { type: Number },
  amenities: {type: Array, required: true},
  images: [{type: String}],
  isAvailable: {type: Boolean, default: true}
}, { _id: false });

const WorkspaceSchema = new mongoose.Schema({
    office: {type: String, ref:"Office", required: true},
    roomType: {type: String, required: true},
    pricing: PricingSchema,

}, {timestamp: true});



const Workspace = mongoose.model("Workspace", WorkspaceSchema)

export default Workspace;