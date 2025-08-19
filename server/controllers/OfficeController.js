import Office from "../models/Office.js";
import User from "../models/User.js";

export const registerOffice = async (req, res) => {
    try {
        const {name, address, contact, city} = req.body;
        const owner = req.user._id;

        //check if User already registered
        const office = await office.findOne({owner})
        if(office){
            return res.json({success: false, message: "Hotel Already Registered"})
        }

        await Office.create({name, address, contact, city, owner})

        await User.findByIdAndUpdate(owner, {role: "officeOwner"})

        res.json({success: true, message: "Office registered successfully"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}