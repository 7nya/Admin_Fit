import React from "react";
import { Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../Screens/Login';
import Person from '../Screens/Person';
import useAuth from "../AuthHook/useAuth";

const Stack = createNativeStackNavigator();

const Navigate = () => {
    const {user} = useAuth();
    if (user){
        return <NavigationContainer>
            <Stack.Screen options={{headerShown: false}} name = "Person" component={Person} />
        </NavigationContainer>
    }else{
        return <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name = "Login" component={Login} />
        </Stack.Navigator>
    </NavigationContainer>
    }
}

export default Navigate;