import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator
} from "react-native";
import React, {
  useState,
  useEffect,
} from "react";
import { firebase } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import Muscle from "../assets/muscle1.png";
import useAuth from "../AuthHook/useAuth";

const ClientsTab = () => {
  const [clients, setClients] = useState([]);
  const db = firebase.firestore();
  const navigation = useNavigation();
  const [pressedIndex, setPressedIndex] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const unsubscribe = db
        .collection("instructors")
        .doc(user.uid)
        .onSnapshot((doc) => {
          const clients = doc.data()?.clients || [];
          if (clients.length > 0) {
            const usersRef = db.collection("users");
            const query = usersRef.where(
              firebase.firestore.FieldPath.documentId(),
              "in",
              clients
            );

            query
              .get()
              .then((snapshot) => {
                const usersData = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setClients(usersData);
              })
              .catch((error) => {
                console.log(
                  "Ошибка при получении данных пользователей:",
                  error
                );
              });
          } else {
            setClients([]);
          }
        });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

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
          navigation.navigate("ClientsStack", {
            user: item,
            coachId: user.uid,
            connectionCollectionId: item.connection,
            connectionCoachId: user.connection,
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
      {clients.length > 0 ? (
        <FlatList
          data={clients}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#32b3be"/>
        </View>
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    color: "#777",
  },
});

export default ClientsTab;
