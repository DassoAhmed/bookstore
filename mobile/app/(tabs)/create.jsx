import { useState } from "react";
import { View, 
         Text, 
         ScrollView, 
         TextInput, 
         TouchableOpacity,
         KeyboardAvoidingView, 
         Platform, 
         Alert,
         Image,
         ActivityIndicator
         } from "react-native";
import { useRouter } from "expo-router";
import styles  from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useAuthStore } from "../../store/authStore";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { API_URL } from "../../constants/api";

export default function Create() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating ] = useState(3);
  const [image, setImage] = useState(null); // to display selected image  
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { token }= useAuthStore();

  const pickImage = async () => {
    try {
      // request permission if needed
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // if permission is not granted, show alert
        // this is important to avoid app crash on android
        if (status !== "granted") {
          Alert.alert("Permission Denied", "We need camera roll permissions to upload an image");
          return;
        }
      }
      // Add image picking logic here if needed
      //launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, //lower quality for smaller base64
        base64: true, //get base64 string
      })

      if (!result.canceled) {
        setImage(result.assets[0].uri);

        //if base64 is provided, use it

        if(result.assets[0].uri) {
          setImageBase64(result.assets[0].base64);
        } else{
          // otherwise, convert to base64
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri,{
            encoding: FileSystem.EncodingType.base64,
          });
          setImageBase64(base64);
        }
      } 
    } catch (error) {
      // Handle error
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleSubmit = async() =>{
    if(!title || !caption || !imageBase64 || !rating) {
      Alert.alert("Missing Fields", "Please fill in all fields and select an image.");
      return;
    } 

    try {
      setLoading(true);

      //get file extension from URI or default to jpeg
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";

      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      const response = await fetch(`${API_URL}/books`,{
        method:"POST",
        headers:{
          Authorization:`Bearer ${token}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           title,
           caption,
           rating: rating.toString(),
           image: imageDataUrl,
        }),
      })

      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "Your book recommendation has been posted");
      setTitle("");
      setCaption("");
      setRating(3);
      setImage(null);
      setImageBase64(null);
      router.push("/");
             
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }} keyboardShouldPersistTaps="handled">
        <View style={ styles.card }>
          {/* HEADER */}
          <Text style={styles.title}>Add Book Recommendation</Text>
          <Text style={styles.subtitle}>Share your favorite reads with others</Text>

          <View style={{ width: '100%' }}>
            {/* BOOK TITLE */}
            <View style={[styles.formGroup, { marginBottom: 12 }]}> 
              <Text style={styles.label}>Book Title</Text>
              <View style={[styles.inputContainer, { alignItems: 'center' }]}> 
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter book title"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            {/* RATING */}
            <View style={[styles.formGroup, { marginBottom: 12 }]}> 
              <Text style={styles.label}>Your Rating</Text>
              <View 
                style={{ backgroundColor: COLORS.cardBackground || '#fff', borderRadius: 12, padding: 12, marginVertical: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, alignItems: 'center', justifyContent: 'center' }}
              >
                {renderRatingPicker()}
              </View>
            </View>

            {/* IMAGE */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <View style={{ backgroundColor: COLORS.cardBackground || '#fff', borderRadius: 12, padding: 12, marginVertical: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style={[styles.imagePicker, { alignSelf: 'center' }]} onPress={pickImage}>
                  {image ? (
                    <Image source={{ uri: image }} style={[styles.previewImage, { alignSelf: 'center' }]} />
                  ) : (
                    <View style={[styles.placeholderContainer, { alignItems: 'center', justifyContent: 'center' }]}> 
                      <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
                      <Text style={styles.placeholderText}>Tap to select image</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            {/* CAPTION */}
            <View style={[styles.formGroup, { marginBottom: 12 }]}>
              <Text style={styles.label}>Caption</Text>
              <View style={[styles.inputContainer, { alignItems: 'center' }]}>
                <Ionicons
                  name="chatbubble-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Write a short caption"
                  placeholderTextColor={COLORS.placeholderText}
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                />
                </View>
            </View>

            {/* SUBMIT BUTTON */} 
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}>
                {loading ? ( 
                  <ActivityIndicator color={COLORS.white} /> 
                ) : (
                  <> 
                  <Ionicons
                  name="cloud-upload-outline"
                  size={20}
                  color={COLORS.white}
                  style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Share</Text>
                </>
              )}
              </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}