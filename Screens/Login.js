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
} from "react-native";
import Muscle from '../assets/muscle2.png';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";


export default Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async() => {
    if (email && password) {
      try {
        await createUserWithEmailAndPassword(auth, email, password)
      } catch(err) {
        console.log('got error: ', err.message)
      }
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Image style={styles.image} source={Muscle} />
      <StatusBar style="auto" />

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email@Example.com"
          placeholderTextColor="#003f5c"
          value={email}
          onChangeText={value => setEmail(value)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          value={password}
          onChangeText={value => setPassword(value)}
        />
      </View>

      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.loginText}>Sign In</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row' }}>

        <TouchableOpacity>
          <Text style={styles.forgot_button}>Forgot Password</Text>
        </TouchableOpacity>

        <Text>     |     </Text>

        <TouchableOpacity onPress = {handleSignUp}>
          <Text style={styles.forgot_button}>Create Account</Text>
        </TouchableOpacity>

      </View>

    </KeyboardAvoidingView>
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
    height: 140
  },

  inputView: {
    backgroundColor: "#b1fff1",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20
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
    backgroundColor: "#32bea6",
  },
});