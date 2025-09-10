import express from "express";
import { protect } from "../middleware/authMiddleWare.js";
import { requireAuth } from '@clerk/express';
import { registerOffice } from "../controllers/OfficeController.js";

const officeRouter = express.Router();


officeRouter.post('/', requireAuth({ override: true }), registerOffice);


export default officeRouter;