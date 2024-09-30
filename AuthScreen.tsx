import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Perform login logic (graphql-request or other method)
    console.log("Logging in:", email, password);
    await AsyncStorage.setItem("userToken", "your_token");
  };

  //   const checkAuth = async () => {
  //     const token = await AsyncStorage.getItem('userToken');
  //     if (token) {
  //       // User is logged in
  //     }
  //   };

  return (
    <View>
      <Text>Sign In / Sign Up</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleLogin} />
    </View>
  );
}
