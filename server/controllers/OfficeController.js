import Office from "../models/Office.js";
import User from "../models/User.js";

export const registerOffice = async (req, res) => {
    try {
        const {name, address, contact, city} = req.body;
        const owner = req.user._id;

        // Check if user already registered an office
        const existingOffice = await Office.findOne({ owner });
        if (existingOffice) {
            return res.json({ success: false, message: "Office Already Registered" });
        }

        // Create new office
        await Office.create({ name, address, contact, city, owner });

        // Update user role
        await User.findByIdAndUpdate(owner, { role: "officeOwner" });

        res.json({ success: true, message: "Office registered successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}