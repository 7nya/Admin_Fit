import React from "react";
import { Image, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Person from "../Screens/UsersTab";
import Settings from "../Screens/SettingsTab";
import ForgotPassword from "../Screens/ForgotPassword";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import usersIcon from "../assets/users.png";
import settingsIcon from "../assets/settings.png";
import Clients from "../Screens/QueryTab";
import fitnessIcon from "../assets/fitness.png"

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const TabNavigate = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: "#32b3be",
        tabBarInactiveBackgroundColor: "#b1fff1",
      }}
    >
      <Tab.Screen
        name="Person"
        component={Person}
        options={{ 
          tabBarLabel: "Person",
          headerShown: true,
          title: "Пользователи",
          headerStyle: { backgroundColor: "#32b3be", },
          headerTitleStyle: { fontSize: 25 },
          tabBarIcon: ({ color, size }) => (
            <Image style = {styles.logo} source={usersIcon}/>
        )
        }}
      />
      <Tab.Screen
        name="Clients"
        component={Clients}
        options={{ 
          tabBarLabel: "Clients",
          headerShown: true,
          title: "Заявки",
          headerStyle: { backgroundColor: "#32b3be", },
          headerTitleStyle: { fontSize: 25 },
          tabBarIcon: ({ color, size }) => (
            <Image style = {{width:50,height:50}} source={fitnessIcon}/>
        )
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{ 
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Image style = {styles.logo} source={settingsIcon}/>
        )
       }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  logo: {
      width: 40,
      height: 40
  }
})

export default TabNavigate;
