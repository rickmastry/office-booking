import Office from "../models/Office.js";
import User from "../models/User.js";

export const registerOffice = async (req, res) => {
    try {

        const {name, address, contact, city} = req.body;
        const clerkUserId = req.auth.userId;
        // Lookup or create user in MongoDB
            let user = await User.findById(clerkUserId);
            if (!user) {
            user = await User.create({ _id: clerkUserId, role: "user" });
            }

            const owner = user._id;

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