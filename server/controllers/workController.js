import Office from "../models/Office.js";
import {v2 as cloudinary} from 'cloudinary';
import Workspace from '../models/Workspace.js';


///api to create a new room for a office

export const createRoom = async (req, res) => {
try {
    const {roomType, Pricing, amenities} = req.body;
    const office = await Office.findOne({owner: req.auth.userId})

    if(!Office) return res.json({success: false, message: "No Office Found"})

    //upload images to cloudinary
    const uploadImages = req.files.map(async () => {
        const response = await cloudinary.uploader.upload(file.path);
        return response.secure_url;
    })

    const images = await Promise.all(uploadImages);

     await Workspace.create({
        office: office._id,
        roomType,
        pricing: +pricing,
        amenities: JSON.parse(amenities),
        images
     })
     res.json({success: true, message: "Workspace created successfully"})
} catch (error) {
    res.json({success: false, message: error.message})
}
}

//api to get all rooms
export const getRooms = async (req, res) => {
    try {
        const workspaces = await Workspace.find({isAvailable: true}).populate({
            path: "office",
            populate:{
                path: 'owner',
                select: "image"
            }
        }).sort({createdAt: -1})
        res.json({success: true, rooms: workspaces})
    } catch (error) {
        res.json({success: false, message: error.message})
    }

}

//api to get all rooms for a specific office location
export const getOwnerRooms = async (req, res) => {
    try {
        const officeData = await Office.findOne({owner: req.auth.userId})
        const workspaces = await Workspace.find({office: officeData._id.toString()}).populate("office");
         res.json({sucess: true, workspaces})
    } catch (error) {
         res.json({success: false, message: error.message})
    }

}

//api to toggle room availability
export const toggleRoomAvailability = async (req, res) => {
    try {
        const {workspaceId} = req.body;
        const workspaceData = await Workspace.findById(workspaceId)
        workspaceData.isAvailable = !workspaceData.isAvailable;
        await workspaceData.save();
         res.json({success: true, message: "Workspace availabilty Updated"})
    } catch (error) {
         res.json({success: false, message: error.message})
    }
}