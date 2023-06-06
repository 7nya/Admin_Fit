import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import Muscle from "../assets/muscle1.png";
import {
  doc,
  updateDoc,
  arrayRemove,
  deleteDoc,
  collection,
  getDocs,
  deleteField,
} from "firebase/firestore";
import { firestore } from "../firebase";
import AwesomeAlert from "react-native-awesome-alerts";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ClientsStack = ({ route }) => {
  const [description, setDescription] = useState("");
  const { coachId } = route.params;
  const { user } = route.params;
  const { connectionCollectionId } = route.params;
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [clientDelete, setClientDelete] = useState(false);
  const [done, setDone] = useState(false);
  const [planAlert, setPlanAlert] = useState(false);
  const storageKey = user.id;

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedDescription = await AsyncStorage.getItem(storageKey);
        if (savedDescription !== null) {
          setDescription(savedDescription);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных из хранилища:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(storageKey, description);
      } catch (error) {
        console.error("Ошибка при сохранении данных в хранилище:", error);
      }
    };

    saveData();
  }, [description]);

  const handleSubmitPlan = async () => {
    if (user) {
      const planRef = collection(
        firestore,
        `connection/${user.connection}/plan`
      );

      const querySnapshot = await getDocs(planRef);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;

        try {
          await updateDoc(docRef, { plan: description });
          setPlanAlert(true);
        } catch (error) {
          console.error("Ошибка при обновлении поля 'plan':", error);
        }
      }
    }
  };

  const confirmDelete = () => {
    setClientDelete(true);
  };

  const Delete = async () => {
    try {
      const coachRef = doc(firestore, `instructors/${coachId}`);
      const userRef = doc(firestore, `users/${user.id}`);

      const chatCollectionRef = collection(
        firestore,
        `connection/${connectionCollectionId}/chat`
      );
      const snapshot = await getDocs(chatCollectionRef);
      snapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      await deleteField(
        doc(firestore, "connection", connectionCollectionId),
        "chat"
      );

      await deleteDoc(doc(firestore, "connection", connectionCollectionId));

      const workoutCollectionRef = collection(
        firestore,
        `connection/${connectionCollectionId}/workout`
      );

      const snapshot2 = await getDocs(workoutCollectionRef);
      snapshot2.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      await deleteField(
        doc(firestore, "connection", connectionCollectionId),
        "workout"
      );

      await deleteDoc(doc(firestore, "connection", connectionCollectionId));

      await updateDoc(coachRef, {
        clients: arrayRemove(user.id),
        connection: arrayRemove(connectionCollectionId),
      });
      await updateDoc(userRef, {
        coach: null,
        connection: null,
      });
      setDone(true);
    } catch (err) {
      console.log("error for sign up with coach: ", err.message);
    }
  };

  let ageText = "";

  if (user.age % 10 === 1 && user.age % 100 !== 11) {
    ageText = "год";
  } else if (
    user.age % 10 >= 2 &&
    user.age % 10 <= 4 &&
    !(user.age % 100 >= 12 && user.age % 100 <= 14)
  ) {
    ageText = "года";
  } else {
    ageText = "лет";
  }

  useEffect(() => {
    setImage(user.avatar);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          {!image ? (
            <Image style={styles.image} source={Muscle} />
          ) : (
            <>
              {image && <Image style={styles.image} source={{ uri: image }} />}
            </>
          )}
          <Text style={styles.title}>
            {user.firstname + " " + user.lastname}
          </Text>
          <Text style={styles.subtitle}>{user.email}</Text>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CalorieDay", { user, coachId })
              }
              style={styles.chatBtn}
            >
              <MaterialCommunityIcons
                name="food-drumstick"
                size={35}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Chat", {
                  ClientId: user.connection,
                })
              }
              style={styles.chatBtn}
            >
              <MaterialCommunityIcons
                name="message-bulleted"
                size={35}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.subtitle, { marginEnd: 200 }]}>
            План тренировок:
          </Text>
          <View style={styles.inputViewDescription}>
            <TextInput
              style={[styles.TextInput, { height: "auto" }]}
              placeholder="Опишите здесь план тренировок клиенту"
              placeholderTextColor="#003f5c"
              value={description}
              onChangeText={(value) => setDescription(value)}
              multiline={true}
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmitPlan}
            style={[styles.loginBtn, { marginTop: 10 }]}
          >
            <Text style={styles.loginText}> Отправить план </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", marginVertical: 6 }}>
            <View style={{ alignItems: "center", flex: 1 }}>
              <MaterialCommunityIcons
                name={user.gender === "Male" ? "gender-male" : "gender-female"}
                size={50}
                color="#32b3be"
              />
              <Text style={{ textAlign: "center" }}>
                {user.gender === "Male" ? "Мужчина" : "Женщина"}
              </Text>
            </View>

            <View style={{ alignItems: "center", flex: 1 }}>
              <MaterialCommunityIcons
                name="human-male-height"
                size={50}
                color="#32b3be"
              />
              <Text style={{ textAlign: "center" }}> {user.height} см</Text>
            </View>

            <View style={{ alignItems: "center", flex: 1 }}>
              <FontAwesome5 name="weight" size={50} color="#32b3be" />
              <Text style={{ textAlign: "center" }}>{user.weight} кг</Text>
            </View>
          </View>
          <View style={{ marginEnd: 60, marginVertical: 10 }}>
            <Text style={styles.subtitle}>Активность: {user.activity}</Text>
            <Text style={styles.subtitle}>Цель: {user.goal}</Text>
            <Text style={styles.subtitle}>
              Возраст: {user.age} {ageText}
            </Text>
          </View>

          <TouchableOpacity onPress={confirmDelete} style={styles.loginBtn}>
            <Text style={styles.loginText}>Удалить клиента</Text>
          </TouchableOpacity>
        </View>

        <AwesomeAlert
          show={clientDelete}
          title="Удаление клиента"
          titleStyle={{
            fontSize: 22,
            color: "red",
          }}
          message="Вы точно хотите удалить клиента?"
          messageStyle={{
            fontSize: 16,
          }}
          showConfirmButton={true}
          confirmText="Удалить"
          confirmButtonColor="red"
          confirmButtonStyle={{
            width: "40%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 25,
          }}
          confirmButtonTextStyle={{
            fontSize: 16,
          }}
          onConfirmPressed={() => {
            Delete();
            setClientDelete(false);
          }}
          showCancelButton={true}
          cancelText="Отмена"
          cancelButtonColor="#32b3be"
          cancelButtonStyle={{
            width: "40%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 25,
          }}
          cancelButtonTextStyle={{
            fontSize: 16,
          }}
          onCancelPressed={() => {
            setClientDelete(false);
          }}
        />

        <AwesomeAlert
          show={done}
          title="Готово"
          titleStyle={{
            fontSize: 22,
            color: "#32b3be",
          }}
          message="Клиент успешно удалён"
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
            setDone(false);
            navigation.navigate("ClientsTab");
          }}
        />

        <AwesomeAlert
          show={planAlert}
          title="Готово"
          titleStyle={{
            fontSize: 22,
            color: "#32b3be",
          }}
          message="План успешно отправлен"
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
            setPlanAlert(false);
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: "#ffe9bd",
  },
  image: {
    marginBottom: 0,
    width: 140,
    height: 140,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#32b3be",
  },
  icon: {
    width: 50,
    height: 50,

    resizeMode: "contain",
  },
  item: {
    backgroundColor: "#b1fff1",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 25,
  },
  title: {
    fontSize: 32,
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 2,
    marginLeft: 10,
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
  loginText: {
    color: "white",
    fontSize: 20,
  },
  chatBtn: {
    width: "25%",
    borderRadius: 100,
    height: 55,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#32b3be",
    borderColor: "#b1fff1",
    borderWidth: 1,
    marginHorizontal: 25,
  },
  chatText: {
    color: "white",
    fontSize: 20,
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
  TextInput: {
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  planBtn: {
    width: 50,
    borderRadius: 25,
    height: 50,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#32b3be",
    borderColor: "#b1fff1",
    borderWidth: 1,
  },
});

export default ClientsStack;
