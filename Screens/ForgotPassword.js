import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
} from "react-native";
import Muscle from "../assets/muscle1.png";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/core";

export default function ForgotPassword() {
  const [email, setEmail] = useState(null);

  const resetPassword = () => {
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          Alert.alert("Password reset email has sent successfully");
        })
        .catch((error) => {
          const errorMessage = error.message;
          Alert.alert(
            "Email not found",
            "Please enter the correct email.",
            [ { text: "OK" } ]
          )
        });
    } else {
        Alert.alert(
            "Empty input field",
            "Please enter the email.",
            [ { text: "OK" } ]
          )
    }
  };

  return (
    <SafeAreaView>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 30,
          marginBottom: 20,
          marginHorizontal: 5,
          marginTop: 10,
        }}
      >
        Reset password
      </Text>
      <Text style={{ fontSize: 20, marginHorizontal: 5 }}>
        Enter the email associated with your account and we'll send an email
        with instructions to reset your password.
      </Text>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.container}>
        <SafeAreaView style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email@Example.com"
            placeholderTextColor="#003f5c"
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
        </SafeAreaView>

        <TouchableOpacity onPress={resetPassword} style={styles.loginBtn}>
          <Text style={styles.loginText}>Send recovery mail</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <Image style={styles.image} source={Muscle} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: 40,
    width: 140,
    height: 140,
    marginLeft: 130,
    marginTop: 200,
  },

  inputView: {
    backgroundColor: "#b1fff1",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    marginTop: 210,
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  forgot_button: {
    height: 30,
    marginBottom: 10,
  },

  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#32b3be",
  },
});
