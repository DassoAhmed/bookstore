import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
  user: null,
  token:null,
  isLoading: false,
// Function to load user data from AsyncStorage
  register: async (username,email,password) => {
   
    set({ isLoading: true });
    try {
      const response = await fetch("https://react-native-bookstoreapi.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username, 
          email, 
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      // Save user and token to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token, user: data.user, isLoading: false });

      return { success: true};     
    } catch (error) {
      set({ isLoading: false });
      console.error("Registration error:", error);
      return { success: false, error: error.message || "Registration failed" };
      
    }
  }

}));