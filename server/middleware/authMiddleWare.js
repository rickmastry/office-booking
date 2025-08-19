import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth(); // Must call as a function
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
};