import React from "react";
import { Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigate from './TabNavigate';
import Login from '../Screens/Login';
import Person from '../Screens/Person';
import useAuth from "../AuthHook/useAuth";
import Registration from "../Screens/Registration";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Navigate = () => {
    const {user} = useAuth();
    if (user){
        return <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Tab" 
                    component={TabNavigate}
                    />
            </Stack.Navigator>
        </NavigationContainer>
    }else{
        return <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    options={{headerShown: false}}
                    name = "Login" 
                    component={Login} 
                    />
                <Stack.Screen 
                    options={{headerShown: false}} 
                    name = "Registration" 
                    component={Registration} 
                    />
            </Stack.Navigator>
            
    </NavigationContainer>
    }
}

export default Navigate;