import { View, 
         Text, 
         TextInput, 
         KeyboardAvoidingView,
         TouchableOpacity,
         ActivityIndicator,
         Platform, 
         Alert} from "react-native";
import styles from "../../assets/styles/login.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useState } from "react";
import {Link} from "expo-router";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";


export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Using Zustand for global state management
  // This allows us to manage user state across the app
  // and access it in other components/screens.
  // The useAuthStore hook provides access to the store.
  // We can use it to get the current user, loading state, and a function to set the user.   
  const {user, isLoading, registerUser } = useAuthStore();

  // Log the user state to see if it's being set correctly
  // This is useful for debugging purposes.
  // You can remove this console.log once you confirm that the user state is working as expected.

  // console.log("User is here:", user);

  const router = useRouter();
  // Function to handle sign up logic
  const handleSignUp = async () => {
    const result = await registerUser(username, email,password);

    if(!result.success) Alert.alert("Error", result.error);
  };  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <View style={styles.card}>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>BookVibes</Text>
              <Text style={styles.subtitle}>Share your favorite reads</Text>
          </View>
          <View style={styles.formContainer}>
            {/* USERNAME INPUT */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                name="person-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Dasso"
                  placeholderTextColor={COLORS.placeholderText}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
          </View>

           <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              // color={require("../../assets/images/email.png")}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.placeholderText}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* PASSWORD INPUT */}
         <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          {/* LEFTICON */}
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
            />
            {/* INPUT */}
            <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.placeholderText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}        
            />

            <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
            >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={COLORS.primary}/>
          
            </TouchableOpacity>
        </View>
        </View>

        {/* SIGNUP BUTTON */}
          <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          disabled={isLoading}    
          >
            {isLoading ? (  <ActivityIndicator color={COLORS.white} /> ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
            )}  
          </TouchableOpacity>

        {/* FOOTER */}
           <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}> 
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
        </View>
        </View>
        </View>
       </View>
    </KeyboardAvoidingView>
  ); 
}