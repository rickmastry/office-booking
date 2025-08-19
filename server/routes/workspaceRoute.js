import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleWare.js";
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from "../controllers/workController.js";

const workspaceRouter = express.Router();

workspaceRouter.post('/', upload.array("images", 4),createRoom);
workspaceRouter.get('/', getRooms);
workspaceRouter.get('/owner', protect, getOwnerRooms);
workspaceRouter.post('/toggle-availability', protect, toggleRoomAvailability);


export default workspaceRouter;