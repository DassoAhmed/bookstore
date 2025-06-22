import { Link } from "expo-router";
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity, 
 } from "react-native";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export default function Index() {
  const { user, token, checkAuth, logout } = useAuthStore()

  console.log(user,token);

  useEffect (() => {
    checkAuth();
  }, [user, token]);
  return (
    <View
      style={styles.container}>
      <Text style={styles.tittle}>Hello {user?.username}</Text>
      <Text style={styles.tittle}>Token: {token}</Text>

      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>

      <Link href="/(auth)/signup">Signup </Link>
      <Link href="/(auth)">Login Page</Link>
    </View>
  ); 
}

const styles = StyleSheet.create({
  container:  {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",  
  },
  tittle: {
    color: "blue",
    fontSize: 20,
    fontWeight: "bold",
  },
})