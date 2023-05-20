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
} from "react-native";
import Muscle from "../assets/muscle1.png";
import { auth, createUserDocument } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import "firebase/database";
import "firebase/auth";
import { firebase } from "../firebase";
import { useRoute } from "@react-navigation/native";
import { CheckBox } from "@rneui/themed";
import { MaterialCommunityIcons, Foundation } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

export default Registration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const route = useRoute();
  const { email, username, isCoach, password, confirmPassword } = route.params;
  const [avatar, setAvatar] = useState(null);

  const navigation = useNavigation();

  const options = [
    { label: "Мужчина", value: "Male" },
    { label: "Женщина", value: "Female" },
  ];

  const handleSignUp = async () => {
    if (firstName && lastName && age && gender) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // User создан, сохраняем информацию в базе данных Firebase
          const user = userCredential.user;
          const isCoach = true; // Устанавливаем флаг администратора для нового пользователя
          return firebase
            .firestore()
            .collection("instructors")
            .doc(user.uid)
            .set({
              age: age,
              description: description,
              username: username,
              firstName: firstName,
              lastName: lastName,
              gender: gender,
              email: email,
              isCoach: isCoach,
              avatar: avatar
            });
        })
        .catch((error) => {
          // Обрабатываем ошибку
          console.error(error);
        });
    } else {
      alert("Заполните все обязательные поля!");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <KeyboardAvoidingView style={styles.container}>
        <Image style={styles.image} source={Muscle} />
        <StatusBar style="auto" />

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Фамилия"
            placeholderTextColor="#003f5c"
            value={lastName}
            onChangeText={(value) => setLastName(value)}
            keyboardType="default"
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Имя"
            placeholderTextColor="#003f5c"
            value={firstName}
            onChangeText={(value) => setFirstName(value)}
          />
        </View>

        <View style={styles.inputPassword}>
          <TextInput
            style={styles.TextInput}
            keyboardType="numeric"
            placeholder="Возраст"
            placeholderTextColor="#003f5c"
            value={age}
            onChangeText={(value) => setAge(value)}
          />
        </View>
        <View style={styles.inputViewDescription}>
          <TextInput
            style={[styles.TextInput, { height: "auto" }]}
            placeholder="Описание (необязательно)"
            placeholderTextColor="#003f5c"
            value={description}
            onChangeText={(value) => setDescription(value)}
            multiline={true}
          />
        </View>

        <View style={styles.checkbox_container}>
          {options.map((option) => (
            <CheckBox
              key={option.value}
              title={option.label}
              checked={gender === option.value}
              onPress={() => setGender(option.value)}
              containerStyle={{ backgroundColor: "#b1fff1" }}
              checkedIcon={
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color="#32b3be"
                />
              }
              uncheckedIcon={
                <MaterialCommunityIcons
                  name="checkbox-blank-circle-outline"
                  size={24}
                  color="#32b3be"
                />
              }
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleSignUp} style={styles.loginBtn}>
          <Text style={styles.loginText}>Регистрация</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
            <Text style={styles.forgot_button}> Назад </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b1fff1",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollViewContainer: {
    flexGrow: 1,
  },

  image: {
    marginTop: 60,
    marginBottom: 40,
    width: 140,
    height: 140,
  },

  inputView: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "80%",
    height: 45,
    marginBottom: 10,
    borderColor: "#32b3be",
    borderWidth: 1,
  },

  inputViewDescription: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "80%",
    height: "auto",
    marginBottom: 0,
    borderColor: "#32b3be",
    borderWidth: 1,
    flex: 1,
  },

  inputPassword: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "80%",
    height: 45,
    marginBottom: 10,
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
});
