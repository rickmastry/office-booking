import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { requireAuth } from "@clerk/express";
import { protect } from "../middleware/authMiddleWare.js";
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from "../controllers/workController.js";

const workspaceRouter = express.Router();

workspaceRouter.post('/', upload.array("images", 4),createRoom);
workspaceRouter.get('/', getRooms);
workspaceRouter.get('/owner', requireAuth(), getOwnerRooms);
workspaceRouter.post('/toggle-availability', requireAuth(), toggleRoomAvailability);


export default workspaceRouter;