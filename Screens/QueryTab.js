import { View, Text, FlatList, Pressable, StyleSheet, Image } from "react-native";
import React, { useState, useEffect, ActivityIndicator } from "react";
import { firebase } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import Muscle from "../assets/muscle1.png";
import useAuth from "../AuthHook/useAuth";

const QueryTab = () => {
  const [users, setUsers] = useState([]);
  const db = firebase.firestore();
  const navigation = useNavigation();
  const [pressedIndex, setPressedIndex] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if(user){
    const unsubscribe = db
      .collection("instructors")
      .doc(user.uid) 
      .onSnapshot((doc) => {
        const clientQuery = doc.data()?.clientQuery || []; // Добавляем '?', чтобы избежать ошибки, если 'clientQuery' отсутствует
        if (clientQuery.length > 0) {
          const usersRef = db
            .collection("users")
            .where(firebase.firestore.FieldPath.documentId(), "in", clientQuery); // Используем FieldPath для сравнения с ID документа
          const unsubscribeUsers = usersRef.onSnapshot((snapshot) => {
            const usersData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUsers(usersData);
          });

          return () => {
            unsubscribeUsers();
          };
        } else {
          setUsers([]); // Если 'clientQuery' пустой, очищаем список пользователей
        }
      }, (error) => {
        console.log("Ошибка при получении данных тренера:", error);
      });

    return () => {
      unsubscribe();
    };
}}, [user]);

  const renderItem = ({ item, index }) => {
    const handlePressIn = () => {
      setPressedIndex(index);
    };

    const handlePressOut = () => {
      setPressedIndex(null);
    };

    if (!user) {
        return (
          <View style={styles.container}>
            <ActivityIndicator />
          </View>
        );
      }

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
          navigation.navigate("QueryStack", { user: item, coachId: user.uid })
        }
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
       <View style={{flexDirection: 'row', alignItems:'center'}}>
          <View style={{marginRight: 16}}>
            <Image 
              style={styles.image} 
              source={item.avatar ? { uri: item.avatar } : Muscle}
            />
          </View>
           
          <View style={{flexShrink: 1}}>
            <Text style={styles.title}>{[item.firstname," ",item.lastname]}</Text>
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

export default QueryTab;
