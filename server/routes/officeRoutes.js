import express from "express";
import { protect } from "../middleware/authMiddleWare.js";
import { registerOffice } from "../controllers/OfficeController.js";

const officeRouter = express.Router();


officeRouter.post('/', protect, registerOffice);


export default officeRouter;