import {create} from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
  
  user: null, // Initial state for user
  token: null, // Initial state for token (if needed)},
  isLoading: false, // Initial loading state
  // Additional state and functions can be added as needed
  // For example, you might want to add a function to log in or log out
  // or to fetch user data from an API.

  register: async (username, email, password) => {
    
    set({isLoading: true}); // Set loading state to true
    try {
        // Simulate an API call to register a user
        // Replace this with your actual API call logic 
        const response = await fetch( "http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            username, 
            email, 
            password 
          }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Something went wrong"); 
     
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        await AsyncStorage.setItem("token", data.token)
    
        set({token: data.token, user:data.user, isLoading: false});
       
        return { success: true};
    } catch (error) {
      set({ isLoading: false});
      return { success: false, error: error.message};
    }
  }

   // Function to update user state
})); 