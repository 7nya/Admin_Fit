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
import { useNavigation } from "@react-navigation/core";
import { firebase } from "../firebase";
import { signOut } from "firebase/auth";
import useAuth from "../AuthHook/useAuth";
import { useRoute } from "@react-navigation/native";
import { CheckBox } from "@rneui/themed";
import { MaterialCommunityIcons, Foundation } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { Avatar } from "@rneui/themed";

const options = [
  { label: "Мужчина", value: "Male" },
  { label: "Женщина", value: "Female" },
];

const Settings = () => {
  const navigation = useNavigation();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setAge(user.age);
      setGender(user.gender);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setDescription(user.description);
      setUsername(user.username);
    }
  }, [user]);

  const checkInfo = () => {
    const regex = /^\d+$/;

    if (age && gender && firstName && lastName && username) {
      if (regex.test(age)) {
        return true;
      } else {
        alert("Недопустимые значения");
        return false;
      }
    } else {
      alert("Заполните все обязательные поля!");
    }
  };

  const handleSubmit = async () => {
    if (checkInfo()) {
      try {
        const userRef = doc(firestore, `instructors/${user.uid}`);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          await updateDoc(userRef, {
            age: age,
            gender: gender,
            firstName: firstName,
            lastName: lastName,
            description: description,
            username: username,
          });
        }
      } catch (err) {
        console.log("got error: ", err.message);
      }
    }
  };

  if (!user) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Image style={styles.image} source={Muscle} />
        <StatusBar style="auto" />
        <Text style={{ alignSelf: "flex-start", marginHorizontal: 50 }}>
          Имя пользователя
        </Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Имя пользователя"
            placeholderTextColor="#003f5c"
            value={username}
            onChangeText={(value) => setUsername(value)}
          />
        </View>

        <Text style={{ alignSelf: "flex-start", marginHorizontal: 50 }}>
          Фамилия
        </Text>
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

        <Text style={{ alignSelf: "flex-start", marginHorizontal: 50 }}>
          Имя
        </Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Имя"
            placeholderTextColor="#003f5c"
            value={firstName}
            onChangeText={(value) => setFirstName(value)}
          />
        </View>

        <Text style={{ alignSelf: "flex-start", marginHorizontal: 50 }}>
          Возраст
        </Text>
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

        <Text style={{ alignSelf: "flex-start", marginHorizontal: 50 }}>
          Описание
        </Text>
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

        <TouchableOpacity onPress={handleSubmit} style={styles.loginBtn}>
          <Text style={styles.loginText}>Обновить данные</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.forgot_button}
          >
            <Text style={styles.loginText}>Изменить пароль</Text>
          </TouchableOpacity>

          <Text> | </Text>

          <TouchableOpacity onPress={handleLogout} style={styles.forgot_button}>
            <Text style={styles.loginText}>Выйти из аккаунта</Text>
          </TouchableOpacity>
        </View>
      </View>
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

  inputPassword: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "80%",
    height: 45,
    marginBottom: 5,
    borderColor: "#32b3be",
    borderWidth: 1,
  },

  image: {
    marginTop: 20,
    width: 140,
    height: 140,
  },

  inputView: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "80%",
    height: 45,
    marginBottom: 5,
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
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#32b3be",
    borderColor: "#b1fff1",
    borderWidth: 1,
  },

  checkbox_container: {
    flexDirection: "row",
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
});

export default Settings;
