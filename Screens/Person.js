import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';

const Person = () => {
  return (
    <View className = "flex-1 flex-row justify-center items-center">
      <Text>Home Page - </Text>
      <TouchableOpacity className = "p-1 bg-red-400 rounded-lg">
        <Text className = "text-white">Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Person
