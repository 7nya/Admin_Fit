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
import { sendPasswordResetEmail } from "firebase/auth";
import AwesomeAlert from 'react-native-awesome-alerts';

export default function ForgotPassword() {
  const [email, setEmail] = useState(null);
  const [send, setSend] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [empty, setEmpty] = useState(false);

  const resetPassword = () => {
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setSend(true);
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage);
          setErrorAlert(true);
        });
    } else {
      setEmpty(true);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Image style={styles.image} source={Muscle} />
      <StatusBar style="auto" />

      <Text style={{ fontSize: 22, marginHorizontal: 10, marginTop: 20 }}>
        Введите адрес электронной почты вашего аккаунта, на которую будет
        отправлено письмо с инструкцией для сброса пароля.
      </Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email@Example.com"
          placeholderTextColor="#003f5c"
          value={email}
          onChangeText={(value) => setEmail(value)}
        />
      </View>

      <TouchableOpacity onPress={resetPassword} style={styles.loginBtn}>
        <Text style={styles.loginText}>Отправить письмо</Text>
      </TouchableOpacity>

      <AwesomeAlert
        show={send}
        title="Готово!"
        titleStyle={{
          fontSize: 22,
          color:'#32b3be'
        }}
        message="Письмо для сброса пароля успешно отправлено!"
        messageStyle={{
          fontSize: 16
        }}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#32b3be"
        confirmButtonStyle={{
          width:'50%',
          alignItems:'center',
          justifyContent:'center',
          borderRadius: 25,
        }}
        confirmButtonTextStyle={{
          fontSize: 16,
        }}
        onConfirmPressed={()=>{
          setSend(false)
        }}
      />

        
<AwesomeAlert
        show={errorAlert}
        title="Почта не найдена"
        titleStyle={{
          fontSize: 22,
          color:'red'
        }}
        message="Пожалуйста, введите корректный адрес электронной почты."
        messageStyle={{
          fontSize: 16
        }}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#32b3be"
        confirmButtonStyle={{
          width:'50%',
          alignItems:'center',
          justifyContent:'center',
          borderRadius: 25,
        }}
        confirmButtonTextStyle={{
          fontSize: 16,
        }}
        onConfirmPressed={()=>{
          setErrorAlert(false)
        }}
      />

<AwesomeAlert
        show={empty}
        title="Пустое поле ввода"
        titleStyle={{
          fontSize: 22,
          color:'red'
        }}
        message="Введите адрес электронной почты"
        messageStyle={{
          fontSize: 16
        }}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#32b3be"
        confirmButtonStyle={{
          width:'50%',
          alignItems:'center',
          justifyContent:'center',
          borderRadius: 25,
        }}
        confirmButtonTextStyle={{
          fontSize: 16,
        }}
        onConfirmPressed={()=>{
          setEmpty(false)
        }}
      />

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b1fff1",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginTop: -60,
    width: 140,
    height: 140,
  },

  inputView: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "90%",
    height: 65,
    marginBottom: 20,
    borderColor: "#32b3be",
    borderWidth: 1,
    marginTop: 20,
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    fontSize: 18,
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
