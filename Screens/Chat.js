import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import { GiftedChat } from "react-native-gifted-chat";
import {
  onSnapshot,
  addDoc,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import { firestore } from "../firebase";
import useAuth from "../AuthHook/useAuth";

export default Chat = ({ route }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const { ClientId } = route.params;

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) {
      setAvatar(user.avatar);
      const messagesCollectionRef = collection(
        firestore,
        `connection/${ClientId}/chat`
      );
      const messagesQuery = query(
        messagesCollectionRef,
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          ...doc.data(),
          _id: doc.id,
        }));

        setMessages(newMessages);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const onSend = async (newMessages = []) => {
    const messagesCollectionRef = collection(
      firestore,
      `connection/${ClientId}/chat`
    );

    const formattedMessages = newMessages.map((message) => ({
      ...message,
      createdAt: message.createdAt.toISOString(),
    }));

    try {
      await Promise.all(
        formattedMessages.map((message) =>
          addDoc(messagesCollectionRef, message)
        )
      );
      console.log("Сообщения успешно отправлены!");
    } catch (error) {
      console.error("Ошибка при отправке сообщений:", error);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (!user || loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#58754B"
        style={styles.loadingScreen}
      />
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <TouchableWithoutFeedback accessible={false} onPress={dismissKeyboard}>
        <View style={styles.container}>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{
              _id: user.uid,
              name: user.firstName,
              avatar: avatar,
            }}
            inverted={false}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#E5E5E5",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffe9bd",
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: "#ffe9bd",
  },
});
