import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Switch,
} from "react-native";
import Muscle from "../assets/muscle1.png";
import { useNavigation } from "@react-navigation/core";
import "firebase/database";
import "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";
import AwesomeAlert from "react-native-awesome-alerts";

export default Registration = ({ route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isCoach = true;
  const [showPassword, setShowPassword] = useState(false);
  const handleToggleSwitch = () => setShowPassword(!showPassword);

  const [passwordError, setPasswordError] = useState(false);
  const [empty, setEmpty] = useState(false);

  const navigation = useNavigation();

  const handleSignUp = () => {
    if (email && password && confirmPassword) {
      if (password == confirmPassword) {
        navigation.navigate("RegistrationNext", {
          email,
          isCoach,
          password,
          confirmPassword,
        });
      } else {
        setPasswordError(true);
      }
    } else {
      setEmpty(true);
    }
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

      <View style={[styles.inputPassword, { flexDirection: "row" }]}>
        <TextInput
          style={styles.TextInput}
          placeholder="Пароль"
          placeholderTextColor="#003f5c"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(value) => setPassword(value)}
        />
        <TouchableOpacity
          onPress={handleToggleSwitch}
          style={{
            justifyContent: "center",
            marginRight: 10,
            color: "#32b3be",
          }}
        >
          <Icon
            name={showPassword ? "eye" : "eye-slash"}
            size={20}
            color="#32b3be"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Подтвердите пароль"
          placeholderTextColor="#003f5c"
          secureTextEntry={!showPassword}
          value={confirmPassword}
          onChangeText={(value) => setConfirmPassword(value)}
        />
      </View>

      <TouchableOpacity onPress={handleSignUp} style={styles.loginBtn}>
        <Text style={styles.loginText}>Далее</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.forgot_button}>Войти</Text>
        </TouchableOpacity>
      </View>

      <AwesomeAlert
        show={passwordError}
        title="Ошибка"
        titleStyle={{
          fontSize: 22,
          color: "red",
        }}
        message="Пароли не совпадают"
        messageStyle={{
          fontSize: 16,
        }}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#32b3be"
        confirmButtonStyle={{
          width: "50%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 25,
        }}
        confirmButtonTextStyle={{
          fontSize: 16,
        }}
        onConfirmPressed={() => {
          setPasswordError(false);
        }}
      />

      <AwesomeAlert
        show={empty}
        title="Ошибка"
        titleStyle={{
          fontSize: 22,
          color: "red",
        }}
        message="Заполните все поля"
        messageStyle={{
          fontSize: 16,
        }}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#32b3be"
        confirmButtonStyle={{
          width: "50%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 25,
        }}
        confirmButtonTextStyle={{
          fontSize: 16,
        }}
        onConfirmPressed={() => {
          setEmpty(false);
        }}
      />
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

  inputPassword: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "80%",
    height: 45,
    marginBottom: 5,
    borderColor: "#32b3be",
    borderWidth: 1,
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

  checkbox_container: {
    flexDirection: "row",
  },

  loginText: {
    color: "white",
    fontSize: 16,
  },
});
