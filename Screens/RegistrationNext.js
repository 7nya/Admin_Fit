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
  Modal,
} from "react-native";
import Muscle from "../assets/muscle1.png";
import { auth, createUserDocument, storage } from "../firebase";
import { firestore } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import "firebase/database";
import "firebase/auth";
import { firebase } from "../firebase";
import { useRoute } from "@react-navigation/native";
import { CheckBox } from "@rneui/themed";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Foundation,
} from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

export default Registration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const route = useRoute();
  const { email, /* username, */ isCoach, password, confirmPassword } = route.params;
  const [avatar, setAvatar] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [clientQuery, setClientQuery] = useState([]);
  const [coachQuery, setCoachQuery] = useState([]);

  const navigation = useNavigation();

  const options = [
    { label: "Мужчина", value: "Male" },
    { label: "Женщина", value: "Female" },
  ];

  const handleSignUp = async () => {
    if (firstName && lastName && age && gender && agreedToTerms) {
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
              /* username: username, */
              firstName: firstName,
              lastName: lastName,
              gender: gender,
              email: email,
              isCoach: isCoach,
              avatar: avatar,
              clientQuery: clientQuery,
              coachQuery: coachQuery,
            });
        })
        .catch((error) => {
          // Обрабатываем ошибку
          console.error(error);
        });
    } else {
      if (agreedToTerms) {
        alert("Заполните все обязательные поля!");
      } else {
        alert("Условия пользовательского соглашения являются обязательными.");
      }
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

        <View style={{ flexDirection: "row", marginVertical: 0 }}>
          <CheckBox
            checked={agreedToTerms}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            containerStyle={{
              backgroundColor: "#b1fff1",
              marginVertical: 8,
              padding: 0,
            }}
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
          <View>
            <Text>Я согласен с условиями</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              type="TERTIARY"
            >
              <Text style={{ color: "#0772A1", marginBottom: 10 }}>
                Пользовательского соглашения
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={handleSignUp} style={styles.loginBtn}>
          <Text style={styles.loginText}>Регистрация</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
            <Text style={styles.forgot_button}> Назад </Text>
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <ScrollView
              style={{
                width: 380,
                height: 350,
                backgroundColor: "#ffe9bd",
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#32b3be",
              }}
            >
              <View
                style={{
                  flexDirection: "row-reverse",
                  marginTop: 5,
                  marginLeft: 5,
                }}
              >
                <AntDesign
                  name="close"
                  style={{ color: "#E52B50", fontSize: 35 }}
                  onPress={() => setModalVisible(false)}
                />
              </View>

              <Text style={styles.title_agreement}>
                Пользовательское соглашение
              </Text>

              <Text style={styles.text_agreement}>
                {"\n"}
                1. При использовании нашего приложения, вы соглашаетесь на сбор
                и использование ваших персональных данных: Фамилия, имя, год
                рождения, email и пол.{"\n"}
                {"\n"}
                2. Мы собираем и обрабатываем ваши персональные данные для целей
                аутентификации и обработки ваших запросов.{"\n"}
                {"\n"}
                3. Мы не передаем ваши персональные данные третьим лицам без
                вашего согласия, за исключением случаев, предусмотренных
                законодательством.{"\n"}
                {"\n"}
                4. Мы храним ваши персональные данные только в течение
                необходимого периода для достижения указанных целей.{"\n"}
                {"\n"}
                5. Мы принимаем меры для обеспечения безопасности ваших данных,
                но не можем гарантировать абсолютную безопасность в Интернете.{"\n"}
                {"\n"}
                6. Вы имеете право запросить доступ, исправление или удаление
                ваших персональных данных в соответствии с применимым
                законодательством.{"\n"}
                {"\n"}
                7. Мы оставляем за собой право внести изменения в настоящее
                соглашение и уведомим вас о таких изменениях.
                {"\n"}
              </Text>
            </ScrollView>
          </View>
        </Modal>
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

  title_agreement: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  text_agreement: {
    fontSize: 15,
    padding: 10,
  },
  img_container: {
    marginTop: -20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
