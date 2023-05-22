import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    ActivityIndicator,
  } from "react-native";
  
  import React, { useEffect, useState } from "react";
  import {
    collection,
    getDoc,
    doc,
    query,
    where,
    getDocs,
  } from "firebase/firestore";
  import { useNavigation } from "@react-navigation/core";
  import { auth, storage } from "../firebase";
  import { firebase, firestore } from "../firebase";
  import useAuth from "../AuthHook/useAuth";
  
  export default function Calorie({ route }) {
    const { user, userId } = route.params;
    const [meals, setMeals] = useState([]);
    const today = new Date().toISOString().split("T")[0];
    useEffect(() => {
      const fetchMeals = async () => {
        if (user) {
          try {
            const userRef = doc(firestore, "users", userId);
            const foodRef = collection(userRef, "food");
            const dateRef = doc(foodRef, today);
            const mealsRef = collection(dateRef, "meals");
            const querySnapshot = await getDocs(mealsRef);
  
            const mealsData = querySnapshot.docs.map((doc) => doc.data());
            setMeals(mealsData);
          } catch (error) {
            console.log("Error fetching meals:", error);
          }
        }
      };
  
      fetchMeals();
    }, [user]);
  
    return (
      <View>
        <View style={styles.container}>
          <FlatList
            data={meals}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.title}>{item.food}</Text>
                <Text style={styles.subtitle}>Калорий: {item.calorie}</Text>
                <Text style={styles.subtitle}>Тип: {item.mealType}</Text>
                <Text style={styles.subtitle}>Время: {item.timestamp}</Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            /* keyExtractor={(item) => item.uid} */
          />
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
      container: {
        flex: 0,
        paddingTop: 0,
        backgroundColor: "#ffe9bd",
      },
      item: {
        backgroundColor: "#fd9",
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 8,
        borderRadius: 14,
      },
      title: {
        fontSize: 28,
      },
      subtitle: {
        fontSize: 18,
      },
    });