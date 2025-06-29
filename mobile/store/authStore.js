import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

export const useAuthStore = create((set) => ({
  user: null,
  token:null,
  isLoading: false,
// Function to load user data from AsyncStorage
  register: async (username,email,password) => {
   
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
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
  },
  
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
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

      //return success response
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      console.error("Login error:", error);
      return { success: false, error: error.message || "Login failed" };
    }
  },
  
  checkAuth: async () =>{
  try {
    const token = await AsyncStorage.getItem("token");
    const userJson = await AsyncStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    set({ token, user });
  } catch (error) {
    console.log("Auth check error:", error);
    
  }
  },


  logout: async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      set({ token: null, user: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

}));