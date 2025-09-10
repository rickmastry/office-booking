//GET/api/user
import User from '../models/User.js';

export const getUserData = async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        // Lookup or create user in MongoDB
        let user = await User.findById(clerkUserId);
        if (!user) {
        user = await User.create({ _id: clerkUserId, role: "user" });
        }
        const recentSearchedCities = req.user.recentSearchedCities;
         res.json({ success: true, role: user.role, recentSearchedCities: user.recentSearchedCities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
     

//store users searched offices

export const storeRecentSearchedCities = async (req, res) => {
            try {
                const {recentSearchedCities} = req.body
                const user = await req.body

                if(user.recentSearchedCities.length < 3){
                    user.recentSearchedCities.push(recentSearchedCities)
                } else {
                    user.recentSearchedCities.shift();
                    user.recentSearchedCities.push(recentSearchedCities);
                }

                await user.save();
                res.json({success: true, message: "Office Added"})
            } catch (error) {
                 res.json({success: false, message: error.message})
            }
}