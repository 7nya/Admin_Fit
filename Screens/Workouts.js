import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import Muscle from "../assets/muscle1.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firestore } from "../firebase";
import { collection } from "firebase/firestore";

const UsersStack = ({ route }) => {
  const { userId } = route.params;
  const { user } = route.params;
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [excersises, setExcersises] = useState(null);
  const [workoutImage, seetWorkoutImage] = useState(null);
  const [sets, setSets] = useState(null);

  const storageKey = user.id;

  const createCollection = async () => {
    if (user) {
      const planRef = collection(
        firestore,
        `connection/${user.connection}/workouts`
      );
      const querySnapshot = await getDocs(planRef);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;

        try {
          await updateDoc(docRef, {
            name: name,
            description: description,
            excersises: excersises,
            workoutImage: workoutImage,
            sets: sets,
          });
          setPlanAlert(true);
        } catch (error) {
          console.error("Ошибка при обновлении поля 'plan':", error);
        }
      }
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    setImage(user.avatar);
  }, []);

  const handleSubmitPlan = async () => {
    if (user) {
      const workoutRef = collection(
        firestore,
        `connection/${user.connection}/workout`
      );

      const querySnapshot = await getDocs(workoutRef);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;

        try {
          await updateDoc(docRef, {
            name: name,
            description: description,
            excersises: excersises,
            workoutImage: workoutImage,
            sets: sets,
          });
          setPlanAlert(true);
        } catch (error) {
          console.error("Ошибка при обновлении поля 'plan':", error);
        }
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          {/* <Image style={styles.image} source={Muscle} /> */}
          {!image ? (
            <>
              <Image style={styles.image} source={Muscle} />
            </>
          ) : (
            <>
              {image && <Image style={styles.image} source={{ uri: image }} />}
            </>
          )}

          <Text style={styles.title}>
            {user.firstname + " " + user.lastname}
          </Text>

          <Text style={styles.subtitle}>{user.email}</Text>

          {/* <View style={{ flexDirection: "row", marginVertical: 6 }}></View> */}
          <Text style={[styles.subtitle, { marginTop: 10 }]}>
            Название программы:{" "}
          </Text>
          <View style={styles.inputViewDescription}>
            <TextInput
              style={[styles.TextInput, { height: 40 }]}
              placeholder="Напишите здесь название программы"
              placeholderTextColor="#003f5c"
              value={description}
              //    multiline={true}
            />
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={openModal}>
            <Text style={styles.loginText}>Создать программу</Text>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            animationType="slide"
            onRequestClose={closeModal}
          >
            <View style={styles.container}>
              <Text style={{ marginTop: 100 }}>Упражнение</Text>
              <View style={styles.inputViewDescription}>
                <TextInput
                  style={[styles.TextInput, { height: 40 }]}
                  placeholder="Опишите здесь план тренировок клиенту"
                  placeholderTextColor="#003f5c"
                  value={description}
                  onChangeText={(value) => setDescription(value)}
                />
              </View>
              <Text>Кол-во повторений</Text>
              <View style={styles.inputViewExcersises}>
                <TextInput
                  style={[styles.TextInput, { height: 40 }]}
                  placeholder="Опишите здесь план тренировок клиенту"
                  placeholderTextColor="#003f5c"
                  value={sets}
                  onChangeText={(value) => setSets(value)}
                  //   multiline={true}
                />
              </View>
              <Text>Описание</Text>
              <View style={[styles.inputViewName]}>
                <TextInput
                  style={[styles.TextInput, { height: 40 }]}
                  placeholder="Опишите здесь план тренировок клиенту"
                  placeholderTextColor="#003f5c"
                  value={excersises}
                  onChangeText={(value) => setExcersises(value)}
                  //     multiline={true}
                />
              </View>
              <TouchableOpacity
                onPress={handleSubmitPlan}
                style={[styles.chatBtn, { marginTop: 10 }]}
              >
                <Text style={styles.loginText}> Отправить тренировку </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chatBtn, { marginHorizontal: 150 }]}
                onPress={closeModal}
              >
                <Text style={styles.loginText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: "#ffe9bd",
    alignContent: "center",
    alignItems: "center",
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
    width: "100%",
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
    marginHorizontal: 10,
  },
  chatBtn: {
    width: "40%",
    borderRadius: 100,
    height: 55,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#32b3be",
    borderColor: "#b1fff1",
    borderWidth: 1,
    marginHorizontal: 15,
  },
  chatText: {
    color: "white",
    fontSize: 20,
  },
  inputViewDescription: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "80%",
    marginBottom: 10,
    borderColor: "#32b3be",
    borderWidth: 1,
  },

  inputViewName: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "80%",
    marginBottom: 10,
    borderColor: "#32b3be",
    borderWidth: 1,
  },

  inputViewSets: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "80%",
    marginBottom: 10,
    borderColor: "#32b3be",
    borderWidth: 1,
  },

  inputViewExcersises: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "80%",
    marginBottom: 10,
    borderColor: "#32b3be",
    borderWidth: 1,
  },
  TextInput: {
    padding: 10,
    marginLeft: 20,
    marginVertical: 0,
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
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: "#ffe9bd",
  },
});

export default UsersStack;
