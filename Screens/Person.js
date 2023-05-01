import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../firebase'

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const db = firebase.firestore();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await db.collection('users').get();
      const usersData = usersCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  return (
    <View>
      {users.map((user) => (
        <Text key={user.id}>{user.username + ' - '}{user.email}</Text>
      ))}
    </View>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#e5e5e5',
    padding: 15,
    borderRadius:15,
    margin:5,
    marginHorizontal:10,  
  },
  innerContainer:{
    alignItems:'center',
    flexDirection: 'column',
  },
  itemHeading:{
    fontWeight:'bold'
  },
  itemText:{
    fontWeight:'300'
  }
})