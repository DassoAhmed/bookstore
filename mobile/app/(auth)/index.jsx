import { View, 
         Text, 
         Image, 
         TextInput, 
         TouchableOpacity, 
         ActivityIndicator, 
         KeyboardAvoidingView,
         Platform} from "react-native";
import {Link} from "expo-router";
import styles from "../../assets/styles/login.styles";
import { useState } from "react";
import COLORS from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const handleLogin = () => {}

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height" } 
    >
    <View style={styles.container}>
      {/* { ILUSTRATION } */}
      <View style={styles.topIllustration}>
        <Image 
        source={require("../../assets/images/i.png")}
        style={styles.illustrationImage}
        resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
      <View style={styles.formContainer}>
        {/* EMAIL */}
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

        {/* PASSWORD */}
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
            onChange={setPassword}
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

        {/* BUTTON SIGNUP */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}    
          >
            {isLoading ? (  <ActivityIndicator color={COLORS.white} /> ) : (
            <Text style={styles.buttonText}>Login</Text>
            )}  

          </TouchableOpacity>
           
           {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
              </Link>
        </View>
      </View>
    </View>
    </View>
    </KeyboardAvoidingView>
  );
}