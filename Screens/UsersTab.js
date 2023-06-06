import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import Muscle from "../assets/muscle1.png";

const UsersTab = () => {
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
        onPress={() =>
          navigation.navigate("UsersStack", {
            user: item,
            userId: item.id,
          })
        }
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ marginRight: 16 }}>
            <Image
              style={styles.image}
              source={item.avatar ? { uri: item.avatar } : Muscle}
            />
          </View>

          <View style={{ flexShrink: 1 }}>
            <Text style={styles.title}>
              {[item.firstname, " ", item.lastname]}
            </Text>
            <Text style={styles.subtitle}>{item.email}</Text>
          </View>
        </View>
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
    backgroundColor: "#ffe9bd",
  },
  item: {
    backgroundColor: "#b1fff1",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 25,
    borderColor: "#32b3be",
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 16,
  },
  image: {
    marginBottom: 0,
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#32b3be",
  },
});

export default UsersTab;
