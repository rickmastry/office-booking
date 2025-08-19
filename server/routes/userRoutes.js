import express from 'express';
import { getUserData, storeRecentSearchedCities } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleWare.js';

const UserRouter = express.Router();

UserRouter.get('/', protect, getUserData);
UserRouter.post('/store-recent-search', protect, storeRecentSearchedCities);

export default UserRouter;