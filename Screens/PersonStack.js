import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../firebase";
import { useNavigation } from "@react-navigation/core";

const PersonStack = ({ route }) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user.username}</Text>
      <Text style={styles.subtitle}>{user.email}</Text>
      <Text style={styles.subtitle}>{user.gender}</Text>
      <Text style={styles.subtitle}>{user.height}</Text>
      <Text style={styles.subtitle}>{user.weight}</Text>
      <Text style={styles.subtitle}>{user.activity}</Text>
      <Text style={styles.subtitle}>{user.goal}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
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
  },
  subtitle: {
    fontSize: 16,
  },
});

export default PersonStack;
