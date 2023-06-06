import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

export default function Calorie({ route }) {
  const { user } = route.params;
  const { date } = route.params;
  const [meals, setMeals] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const fetchMeals = async () => {
      if (user) {
        try {
          const userRef = doc(firestore, "users", user.id);
          const foodRef = collection(userRef, "food");
          const dateRef = doc(foodRef, date);
          const mealsRef = collection(dateRef, "meals");
          const querySnapshot = await getDocs(mealsRef);

          const mealsData = querySnapshot.docs.map((doc) => doc.data());

          const mealsDataWithCaloriesAsNumbers = mealsData.map((item) => ({
            ...item,
            calorie: parseInt(item.calorie),
          }));

          setMeals(mealsDataWithCaloriesAsNumbers);

          const totalCalories = mealsDataWithCaloriesAsNumbers.reduce(
            (sum, item) => sum + item.calorie,
            0
          );
          setTotalCalories(totalCalories);
        } catch (error) {
          console.log("Error fetching meals:", error);
        }
      }
    };

    fetchMeals();
  }, [user]);

  return (
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
      />

      <Text style={styles.totalCalories}>
        Общее количество калорий: {totalCalories}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  totalCalories: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
});
