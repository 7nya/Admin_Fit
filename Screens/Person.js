import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../firebase";
import { useNavigation } from "@react-navigation/core";

const Person = () => {
  const [users, setUsers] = useState([]);
  const db = firebase.firestore();
  const navigation = useNavigation();
  const [pressedIndex, setPressedIndex] = useState(null);

  useEffect(() => {
    const unsubscribe = db.collection("users").onSnapshot((snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item, index }) => {
    const handlePressIn = () => {
      setPressedIndex(index);
    };

    const handlePressOut = () => {
      setPressedIndex(null);
    };

    return (
      <Pressable
        style={({ pressed }) => [
          styles.item,
          {
            backgroundColor:
              pressed || pressedIndex === index ? "#32b3be" : "#b1fff1",
          },
        ]}
        onPress={() => navigation.navigate("PersonStack", { user: item })}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.title}>{[item.firstname," ",item.lastname]}</Text>
        <Text style={styles.subtitle}>{item.email}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  item: {
    backgroundColor: "#b1fff1",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 25,
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 16,
  },
});

export default Person;
