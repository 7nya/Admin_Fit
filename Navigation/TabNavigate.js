import React from "react";
import { Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Person from "../Screens/Person";
import Settings from "../Screens/Settings";

const Tab = createBottomTabNavigator();

const TabNavigate = () => {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveBackgroundColor: '#32b3be',
            tabBarInactiveBackgroundColor: '#b1fff1'
            }}>
                <Tab.Screen
                name = "Person"
                component={Person}
                options={{
                    tabBarLabel: 'Person',
                }}
                />
                <Tab.Screen
                name = "Settings"
                component={Settings}
                options={{
                    tabBarLabel: 'Settings',
                }}
                />
        </Tab.Navigator>
    )

}

export default TabNavigate;