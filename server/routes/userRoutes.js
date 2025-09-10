import express from 'express';
import { getUserData, storeRecentSearchedCities } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleWare.js';
import { requireAuth } from "@clerk/express";

const UserRouter = express.Router();

UserRouter.get('/', requireAuth(), getUserData);
UserRouter.post('/store-recent-search', requireAuth(), storeRecentSearchedCities);

export default UserRouter;