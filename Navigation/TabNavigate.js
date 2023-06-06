import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UsersTab from "../Screens/UsersTab";
import SettingsTab from "../Screens/SettingsTab";
import QueryTab from "../Screens/QueryTab";
import ClientsTab from "../Screens/ClientsTab";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
        name="UsersTab"
        component={UsersTab}
        options={{
          tabBarLabel: "UsersTab",
          headerShown: true,
          title: "Пользователи",
          headerStyle: { backgroundColor: "#32b3be" },
          headerTitleStyle: { fontSize: 25 },
          headerTintColor: "white",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="users" size={30} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="ClientsTab"
        component={ClientsTab}
        options={{
          tabBarLabel: "ClientsTab",
          headerShown: true,
          title: "Клиенты",
          headerStyle: { backgroundColor: "#32b3be" },
          headerTitleStyle: { fontSize: 25 },
          headerTintColor: "white",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-check" size={30} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="QueryTab"
        component={QueryTab}
        options={{
          tabBarLabel: "QueryTab",
          headerShown: true,
          title: "Заявки",
          headerStyle: { backgroundColor: "#32b3be" },
          headerTitleStyle: { fontSize: 25 },
          headerTintColor: "white",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="email-multiple"
              size={30}
              color="black"
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsTab}
        options={{
          tabBarLabel: "SettingsTab",
          headerShown: true,
          title: "Профиль",
          headerStyle: { backgroundColor: "#32b3be" },
          headerTitleStyle: { fontSize: 25 },
          headerTintColor: "white",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-cog" size={30} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
  },
});

export default TabNavigate;
