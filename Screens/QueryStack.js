import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import Muscle from "../assets/muscle1.png";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
} from "firebase/firestore";
import { firestore } from "../firebase";
import AwesomeAlert from "react-native-awesome-alerts";

const QueryStack = ({ route }) => {
  const { coachId } = route.params;
  const { user } = route.params;
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

  const [apply, setApply] = useState(false);
  const [cancel, setCancel] = useState(false);

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

  const Apply = async () => {
    try {
      const coachRef = doc(firestore, `instructors/${coachId}`);
      const userRef = doc(firestore, `users/${user.id}`);

      const connectionCollectionRef = await addDoc(
        collection(firestore, "connection"),
        {}
      );

      const connectionCollectionId = connectionCollectionRef.id;

      await updateDoc(connectionCollectionRef, {
        participants: [user.id, coachId],
      });

      const planCollectionRef = collection(
        firestore,
        `connection/${connectionCollectionId}/plan`
      );
      await addDoc(planCollectionRef, {
        plan: null,
      });

      const workoutsCollectionRef = collection(
        firestore,
        `connection/${connectionCollectionId}/workouts`
      );
      await addDoc(workoutsCollectionRef, {
        name: null,
        description: null,
        excersises: null,
        workoutImage: null,
        sets: null,
      });

      await updateDoc(coachRef, {
        connection: arrayUnion(connectionCollectionId),
        clientQuery: arrayRemove(user.id),
        clients: arrayUnion(user.id),
      });

      await updateDoc(userRef, {
        connection: connectionCollectionId,
        coachQuery: null,
        coach: coachId,
      });

      setApply(true);
    } catch (err) {
      console.log("error for sign up with coach: ", err.message);
    }
  };
  const Cancel = async () => {
    try {
      const coachRef = doc(firestore, `instructors/${coachId}`);
      const userRef = doc(firestore, `users/${user.id}`);
      await updateDoc(coachRef, {
        clientQuery: arrayRemove(user.id),
      });
      await updateDoc(userRef, {
        coachQuery: null,
      });
      setCancel(true);
    } catch (err) {
      console.log("error for sign up with coach: ", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        {!image ? (
          <>
            <Image style={styles.image} source={Muscle} />
          </>
        ) : (
          <>{image && <Image style={styles.image} source={{ uri: image }} />}</>
        )}

        <Text style={styles.title}>{user.firstname + " " + user.lastname}</Text>
        <Text style={styles.subtitle}>{user.email}</Text>

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

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={Apply} style={styles.loginBtn}>
            <Text style={styles.loginText}>Принять</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={Cancel} style={styles.cancelBtn}>
            <Text style={styles.loginText}>Отклонить</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AwesomeAlert
        show={apply}
        title="Заявка принята"
        titleStyle={{
          fontSize: 22,
          color: "#32b3be",
        }}
        message="Заявка пользователя успешно принята"
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
          setApply(false);
          navigation.navigate("QueryTab");
        }}
      />

      <AwesomeAlert
        show={cancel}
        title="Заявка отклонена"
        titleStyle={{
          fontSize: 22,
          color: "red",
        }}
        message="Заявка пользователя отклонена"
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
          setCancel(false);
          navigation.navigate("QueryTab");
        }}
      />
    </View>
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
    width: "40%",
    borderRadius: 25,
    height: 50,
    marginBottom: 10,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#32b3be",
    borderColor: "#b1fff1",
    borderWidth: 1,
  },
  cancelBtn: {
    width: "40%",
    borderRadius: 25,
    height: 50,
    marginBottom: 10,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    borderColor: "pink",
    borderWidth: 1,
  },
  loginText: {
    color: "white",
    fontSize: 20,
  },
});

export default QueryStack;
