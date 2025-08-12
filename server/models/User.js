import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    username: {type: String},
    email: {type: String, required: true},
    image: {type: String},
    role: {type: String, enum: ["user", "officeAdmin"], default: "user"},
    recentSearchedCities: [{type: String, required: true}],
}, {timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;