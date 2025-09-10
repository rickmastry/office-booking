import { useAuth, useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();

    const [isOwner, setIsOwner] = useState(false);
    const [showAttaReg, setShowAttaReg] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [searchedCities, setSearchedCities] = useState([]); // max 3 recent searched cities

    const facilityIcons = {
        "Free WiFi": assets.freeWifiIcon,
        "Free Breakfast": assets.freeBreakfastIcon,
        "Room Service": assets.roomServiceIcon,
        "Mountain View": assets.mountainIcon,
        "Pool Access": assets.poolIcon,
    };

    const fetchUser = async () => {
        try {
            const token = await getToken();
            if (!token) {
                console.log("No token yet, retrying in 2s...");
                setTimeout(fetchUser, 2000);
                return;
            }
            const { data } = await axios.get('/api/user', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                setIsOwner(data.role === "officeOwner");
                setSearchedCities(data.recentSearchedCities)
            } else {
                // Retry Fetching User Details after 2 seconds
                // Useful when user creates account using email & password
                setTimeout(() => {
                    fetchUser();
                }, 2000);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get('/api/workspace')
            if (data.success) {
                setRooms(data.workspaces)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const { isLoaded } = useAuth();

    useEffect(() => {
        const init = async () => {
            if (!isLoaded) return; // Wait until Clerk is fully loaded
            if (!user) return;     // Only run if a Clerk user exists

            const token = await getToken();
            if (token) {
                fetchUser();
            } else {
                console.log("Token not ready, retrying init in 2s...");
                setTimeout(init, 2000);
            }
        };
        init();
    }, [user, isLoaded]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const value = {
        currency, navigate,
        user, getToken,
        isOwner, setIsOwner,
        axios,
        showAttaReg, setShowAttaReg,
        facilityIcons,
        rooms, setRooms,
        searchedCities, setSearchedCities
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );

};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);