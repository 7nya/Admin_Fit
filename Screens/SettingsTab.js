import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Muscle from "../assets/muscle1.png";
import { auth, storage } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { signOut } from "firebase/auth";
import useAuth from "../AuthHook/useAuth";
import { CheckBox } from "@rneui/themed";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { FontAwesome } from "@expo/vector-icons";
import AwesomeAlert from "react-native-awesome-alerts";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const options = [
  { label: "Мужчина", value: "Male" },
  { label: "Женщина", value: "Female" },
];

export default SettingsTab = ({}) => {
  const navigation = useNavigation();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const { user } = useAuth();
  const [alert, setAlert] = useState(false);

  const changeImage = async () => {
    await deleteImage();
    await pickImage();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      const uploadURL = await uploadImageAsync(selectedAsset.uri);
      if (uploadURL) {
        setImage(uploadURL);
        try {
          const userRef = doc(firestore, `instructors/${user.uid}`);
          await updateDoc(userRef, {
            avatar: uploadURL,
          });
        } catch (err) {
          console.log("got error: ", err.message);
        }
      }
    } else {
      setImage(null);
    }
  };

  const uploadImageAsync = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    try {
      const storageRef = ref(storage, `avatars/image-${Date.now()}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.log(`Error: ${error}`);
      alert(`Error: ${error}`);
      return null;
    }
  };

  const deleteImage = async () => {
    const deleteRef = ref(storage, image);
    try {
      await deleteObject(deleteRef);
      setImage(null);
      try {
        const userRef = doc(firestore, `instructors/${user.uid}`);
        await updateDoc(userRef, {
          avatar: null,
        });
      } catch (err) {
        console.log("got error: ", err.message);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    if (user) {
      setAge(user.age);
      setGender(user.gender);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setDescription(user.description);
      setImage(user.avatar);
    }
  }, [user]);

  const checkInfo = () => {
    const regex = /^\d+$/;

    if (age && gender && firstName && lastName) {
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
          });
        }
        setAlert(true);
      } catch (err) {
        console.log("got error: ", err.message);
      }
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#32b3be"/>
      </View>
    );
  }

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {!image ? (
          <>
            <Image style={styles.image} source={Muscle} />
            <View style={styles.img_container}>
              <View style={styles.change_icon}>
                <TouchableOpacity
                  style={{ marginLeft: 100 }}
                  onPress={pickImage}
                >
                  <MaterialIcons name="edit" size={24} color="#32b3be" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            {image && <Image style={styles.image} source={{ uri: image }} />}
            <View style={styles.img_container}>
              <TouchableOpacity
                style={{ marginRight: 50 }}
                onPress={deleteImage}
              >
                <FontAwesome name="trash" size={24} color="#32b3be" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginLeft: 50 }}
                onPress={changeImage}
              >
                <MaterialIcons name="edit" size={24} color="#32b3be" />
              </TouchableOpacity>
            </View>
          </>
        )}

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
              containerStyle={{ backgroundColor: "#ffe9bd" }}
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
            <Text>Изменить пароль</Text>
          </TouchableOpacity>

          <Text> | </Text>

          <TouchableOpacity onPress={handleLogout} style={styles.forgot_button}>
            <Text>Выйти из аккаунта</Text>
          </TouchableOpacity>
        </View>
      </View>
      <AwesomeAlert
          show={alert}
          title="Готово"
          titleStyle={{
            fontSize: 22,
            color: "#32b3be",
          }}
          message="Данные изменены"
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
            setAlert(false);
          }}
        />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe9bd",
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
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#32b3be",
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

  img_container: {
    marginTop: -20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  change_icon: {
    alignItems: "flex-end",
  },

  loginText: {
    color: "white",
    fontSize: 16,
  },
});
