import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../constants/colors"

export default function SafeScreen({children}) {
      const insets = useSafeAreaInsets();
    
      return <View >{children}</View>; 
}

const styles = StyleSheet.create({
    container: {
       flex: 1,
       backgroundColor: COLORS.background,
    },
});