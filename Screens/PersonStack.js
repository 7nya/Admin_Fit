import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import Muscle from "../assets/muscle1.png";
import genderIcon from "../assets/genderIcon.png";
import heightIcon from "../assets/height.png";
import weightIcon from "../assets/weight.png";

const PersonStack = ({ route }) => {
  const { user } = route.params;
  const db = firebase.firestore();

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
    const unsubscribe = db.collection("users").onSnapshot((snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const usersCollectionRef = db.collection("users");

  const userDocRef = usersCollectionRef.doc(user.id);

  const foodCollectionRef = userDocRef.collection("food");

  const mealsCollectionRef = foodCollectionRef
    .doc("2023-05-17")
    .collection("meals");

  const mealsDocRef = mealsCollectionRef.doc("mi3fSdVNOqJTBjZbU8nM");

  mealsCollectionRef
    .get()
    .then((querySnapshot) => {
      const meals = [];
      querySnapshot.forEach((doc) => {
        meals.push(doc.data());
      });
      // Используйте массив meals для отображения данных на экране
      //console.log(meals);
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Image style={styles.image} source={Muscle} />
        <Text style={styles.title}>{user.firstname + " " + user.lastname}</Text>
        <Text style={styles.subtitle}>{user.email}</Text>

        <View style={{ flexDirection: "row", marginVertical: 6 }}>
          <View style={{ alignItems: "center", flex: 1 }}>
            <Image style={styles.icon} source={genderIcon} />
            <Text style={{ textAlign: "center" }}>
              {user.gender === "Male" ? "Мужчина" : "Женщина"}
            </Text>
          </View>

          <View style={{ alignItems: "center", flex: 1 }}>
            <Image style={styles.icon} source={heightIcon} />
            <Text style={{ textAlign: "center" }}> {user.height} см</Text>
          </View>

          <View style={{ alignItems: "center", flex: 1 }}>
            <Image style={styles.icon} source={weightIcon} />
            <Text style={{ textAlign: "center" }}>{user.weight} кг</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Активность: {user.activity}</Text>
        <Text style={styles.subtitle}>Цель: {user.goal}</Text>
        <Text style={styles.subtitle}>
          Возраст: {user.age} {ageText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: "#b1fff1",
  },
  image: {
    marginBottom: 0,
    width: 140,
    height: 140,
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
});

export default PersonStack;
