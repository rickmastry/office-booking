import express from'express'
import { checkAvailabilityAPI, createBooking, getOfficeBookings, getUserBookings } from '../controllers/bookingController.js'
import { protect } from '../middleware/authMiddleWare.js';
import { requireAuth } from "@clerk/express";

const bookingRouter = express.Router()

bookingRouter.post('/check-availability', checkAvailabilityAPI)
bookingRouter.post('/book', requireAuth(), createBooking);
bookingRouter.get('/user', requireAuth(), getUserBookings);
bookingRouter.get('/office', requireAuth(), getOfficeBookings);

export default bookingRouter