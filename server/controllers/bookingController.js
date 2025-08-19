//function to check availability

import Booking from "../models/Booking.js"
import Office from "../models/Office.js";
import Workspace from "../models/Workspace.js";

const checkAvailability = async ({checkInDate, checkOutDate, workspace}) => {
   try {
     const bookings = await Booking.find({
        workspace,
        checkInDate: {$lte: checkOutDate},
        checkOutDate: {$gte: checkInDate},
     });
     const isAvailable = bookings.length === 0;
     return isAvailable;
   } catch (error) {
      console.error(error.message)
   }
}

//api to check availabilty of workspace
//Post /api/bookings/check-availablity

export const checkAvailabilityAPI = async (req, res) => {
    try {
        const {workspace, checkInDate, checkOutDate} = req.body;
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, workspace})
        res.json({success: true, isAvailable})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const createBooking = async (req, res) => {
    try {
        const {checkInDate, checkOutDate, workspace, guests} = req.body;
        const user = req.user._id;

        const isAvailable = await checkAvailability({checkInDate, checkOutDate, workspace})

        if(!isAvailable){
            return res.json({success: false, message: "Workspace not available"})
        }
        //Get total price for workspace
        const workspaceData = await Workspace.findById(workspace).populate("office")

        let totalPrice = workspaceData.pricing;

        //Calculate totalPrice based on days
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

        totalPrice *= days;

        const booking = await Booking.create({
            user,
            workspace,
            office: workspaceData.office._id,
            guests: +guests,
            checkInData,
            checkOutDate,
            totalPrice

        })

        res.json({success: true, message: "booking created successfully"})


    } catch (error) {
        console.log(error)
         res.json({success: false, message: "Failed to creat booking"})
    }
};

//api to get all bookings for a user
//GET /api/bokkings/user

export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user }).populate("workspace office").sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

export const getOfficeBookings = async (req, res) => {
  try {
    const office = await Office.findOne({ owner: req.auth.userId });
    if (!office) {
      return res.json({ success: false, message: "No Office found" });
    }
    const bookings = await Booking.find({ office: office._id }).populate("room office user").sort({ createdAt: -1 });
    // Total Bookings
    const totalBookings = bookings.length;
    // Total Revenue
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};






