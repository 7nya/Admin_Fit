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
  ActivityIndicator,
  Switch,
} from "react-native";
import Muscle from "../assets/muscle1.png";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import { firebase } from "../firebase";
import Icon from 'react-native-vector-icons/FontAwesome';


export default Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleToggleSwitch = () => setShowPassword(!showPassword);

  const navigation = useNavigation();

  const handleSignIn = async () => {
    setIsLoading(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Успешный вход в систему, проверяем, является ли пользователь администратором
        const user = userCredential.user;
        const userRef = firebase.firestore().collection("users").doc(user.uid);
        userRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              // Пользователь найден в базе данных Firebase
              const userData = doc.data();
              if (userData.isCoach == false) {
                alert("Access denied. User is not an administrator.");
                firebase.auth().signOut();
                // Пользователь является администратором, перенаправляем на страницу для администраторов
              }
            }
          })
          .catch((error) => {
            // Обрабатываем ошибку
            alert(error);
          });
      })
      .catch((error) => {
        // Обрабатываем ошибку
        alert(error);
      }) //;
/*       .finally(() => {
        setIsLoading(false);
      }); */
  };

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
          onChangeText={(value) => setEmail(value)}
        />
      </View>

      <View style={[styles.inputView, { flexDirection: "row" }]}>
        <TextInput
          style={styles.TextInput}
          placeholder="Пароль"
          placeholderTextColor="#003f5c"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(value) => setPassword(value)}
        />
        <TouchableOpacity onPress={handleToggleSwitch} style={{
          justifyContent:'center',
          marginRight:10,
          color:'#32b3be'
          }}>
        <Icon 
        name={showPassword ? 'eye' : 'eye-slash'} 
        size={20} 
        color='#32b3be'
        />
      </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleSignIn} style={styles.loginBtn}>
        {isLoading ? (
          <ActivityIndicator 
            size="large"
            color="white"
          />
        ) : (
          <Text style={styles.loginText}>Войти</Text>
        )}
      </TouchableOpacity>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgot_button}>Забыли пароль?</Text>
        </TouchableOpacity>

        <Text> | </Text>

        <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
          <Text style={styles.forgot_button}>Создать аккаунт</Text>
        </TouchableOpacity>
      </View>

      {isLoading && <ActivityIndicator />}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b1fff1",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: 40,
    width: 140,
    height: 140,
  },

  inputView: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "80%",
    height: 45,
    marginBottom: 20,
    borderColor: "#32b3be",
    borderWidth: 1,
  },

  TextInput: {
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  forgot_button: {
    height: 30,
    marginBottom: 10,
  },

  loginBtn: {
    width: "50%",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#32b3be",
    borderColor: "#b1fff1",
    borderWidth: 1,
  },

  loginText: {
    color: "white",
    fontSize: 16
  }
});
