
import React, { createContext, useState, useEffect, useContext} from "react";
import apiRequest from "../lib/apiRequest";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Function to verify and load user data
  const loadUserData = () => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const userData = JSON.parse(stored);
        setCurrentUser({
          ...userData,
          isAdmin: userData.isAdmin || false // Default to false if missing
        });
        return userData;
      }
      setCurrentUser(null);
      return null;
    } catch (error) {
      console.error("Error loading user data:", error);
      setCurrentUser(null);
      return null;
    }
  };

  // Initial load
  useEffect(() => {
    loadUserData();
  }, []);

  // Update refreshUserData to also refresh the user data
  // const refreshUserData = async () => {
  //   try {
  //     const userData = loadUserData(); // Reload user data
  //     if (userData) {
  //       const wishlistResponse = await apiRequest.get("/user/wishlist");
  //       setWishlistItems(wishlistResponse.data);
  //     }
  //   } catch (error) {
  //     console.error("Failed to refresh user data:", error);
  //   }
  // };

  // const refreshUserData = async () => {
  //   try {
  //     const response = await apiRequest.get('/users/me'); // Add this endpoint in backend
  //     const updatedUser = {
  //       ...response.data,
  //       isAdmin: response.data.isAdmin || false
  //     };
  //     localStorage.setItem("user", JSON.stringify(updatedUser));
  //     setCurrentUser(updatedUser);
  //     return updatedUser;
  //   } catch (error) {
  //     console.error("Failed to refresh user data:", error);
  //     return null;
  //   }
  // };

  const refreshUserData = async () => {
    try {
      // Fetch latest user data
      const response = await apiRequest.get('/users/me');
// Force cookie refresh for cross-domain
    // if(process.env.NODE_ENV === 'production') {
    //   document.cookie = `jwt=${response.data.token}; Path=/; Secure; SameSite=None`;
    // }
      
      const updatedUser = {
        ...response.data,
        isAdmin: response.data.isAdmin || false,
      };
  
      // Update localStorage and context
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
  
      // Fetch additional data (e.g., wishlist items)
      const wishlistResponse = await apiRequest.get("/user/wishlist");
      setWishlistItems(wishlistResponse.data);
  
      return updatedUser;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      return null;
    }
  };



  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await apiRequest.get("/users/me");
        setCurrentUser(res.data);
      } catch (err) {
        setCurrentUser(null);
      }
    };
    validateToken();
  }, []);


//   const login =  async (userData) => {
// // Ensure admin status is properly stored
// const userWithAdmin = {
//   ...userData,
//   isAdmin: userData.isAdmin || false
// };

//     localStorage.setItem("user", JSON.stringify(userWithAdmin));
//     setCurrentUser(userWithAdmin);
//   };


const login = async (userData) => {
  try {
    const res = await apiRequest.post("/auth/login", userData);
    setCurrentUser(res.data.user);
    
    // Force refresh to validate admin status
    await validateToken(); 
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};
// const login = async (userData) => {
//   try {
//     const res = await apiRequest.post("/auth/login", userData);

//     // Refresh user data after login to ensure proper state management
//     // await refreshUserData();
    
//     toast.success(res.data.message);
//     setCurrentUser(res.data.user);
    
//     navigate("/"); // Redirect after successful login
//   } catch (err) {
//     console.error("Login error:", err);
//     toast.error(err.response?.data?.message || "Login failed");
//     throw err;
//   }
// };




  
// Validate token and permissions
const validateToken = async () => {
  try {
    const res = await apiRequest.get("/users/me");
    setCurrentUser(res.data);
    return res.data;
  } catch (err) {
    setCurrentUser(null);
    return null;
  }
};

  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    setWishlistItems([]);
  };

  const updateUser = (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        refreshUserData,
        currentUser,
        setCurrentUser, 
        login, 
        logout,
        updateUser,
        validateToken,
        wishlistItems,
        loadUserData // Export this function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
