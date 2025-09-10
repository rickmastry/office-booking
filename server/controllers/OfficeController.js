import Office from "../models/Office.js";
import User from "../models/User.js";

export const registerOffice = async (req, res) => {
    try {
        console.log("registerOffice called, req.auth:", req.auth);
        console.log("req.auth:", req.auth); // debug Clerk
        console.log("req.user:", req.user); // debug user
        const {name, address, contact, city} = req.body;
        const owner = req.auth.userId;

         if (!owner) {
          return res.status(401).json({ success: false, message: "Not authenticated" });
         }

        // Check if user already registered an office
        const existingOffice = await Office.findOne({ owner });
        if (existingOffice) {
            return res.status(400).json({ success: false, message: "Office Already Registered" });
        }

        // Create new office
        await Office.create({ name, address, contact, city, owner });

        // Update user role
        await User.findByIdAndUpdate(owner, { role: "officeOwner" });

        return res.status(201).json({ success: true, message: "Office registered successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}