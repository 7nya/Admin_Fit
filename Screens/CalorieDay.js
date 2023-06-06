import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { collection } from "firebase/firestore";
import { firestore } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { useNavigation } from "@react-navigation/core";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function Calorie({ route }) {
  const { user } = route.params;
  const navigation = useNavigation();
  const [documents, setDocuments] = useState([]);
  const { coachId } = route.params;
  const [pressedIndex, setPressedIndex] = useState(null);

  useEffect(() => {
    const foodCollectionRef = collection(firestore, "users", user.id, "food");
    const unsubscribe = onSnapshot(foodCollectionRef, (snapshot) => {
      const updatedDocuments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortedDocuments = updatedDocuments.sort((a, b) =>
        b.date.localeCompare(a.date)
      );
      setDocuments(sortedDocuments);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.item,
          {
            backgroundColor:
              pressed || pressedIndex === index ? "#32b3be" : "#b1fff1",
          },
        ]}
        onPress={() =>
          navigation.navigate("Calorie", { user, coachId, date: item.date })
        }
      >
        <Text style={styles.dateText}>
          {format(new Date(item.date), "EEEE, d MMMM", { locale: ru })}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={documents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe9bd",
  },
  itemContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
  },
  dateText: {
    textAlign: "center",
    fontSize: 20,
  },
  item: {
    backgroundColor: "#b1fff1",
    padding: 30,
    marginVertical: 4,
    marginHorizontal: 4,
    borderRadius: 10,
    borderColor: "#32b3be",
  },
});
