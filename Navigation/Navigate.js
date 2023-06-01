import React from "react";
import { Image, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigate from "./TabNavigate";
import useAuth from "../AuthHook/useAuth";

import Login from "../Screens/Login";
import Registration from "../Screens/Registration";
import RegistrationNext from "../Screens/RegistrationNext";
import ForgotPassword from "../Screens/ForgotPassword";
import UsersStack from "../Screens/UsersStack";
import Calorie from "../Screens/Calorie";
import QueryStack from "../Screens/QueryStack";
import ClientsStack from "../Screens/ClientsStack";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Navigate = () => {
  const { user } = useAuth();
  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Tab"
            component={TabNavigate}
          />
          <Stack.Screen
            options={{
               headerShown: true,
               title: "Информация",
               headerStyle: { backgroundColor: "#32b3be", },
               headerTitleStyle: { fontSize: 25 }, 
               headerTintColor: "white",
              }}
            name="UsersStack"
            component={UsersStack}
          />
          <Stack.Screen
            options={{
               headerShown: true,
               title: "Информация",
               headerStyle: { backgroundColor: "#32b3be", },
               headerTitleStyle: { fontSize: 25 }, 
               headerTintColor: "white",
              }}
            name="ClientsStack"
            component={ClientsStack}
          />
          <Stack.Screen
            options={{
               headerShown: true,
               title: "Заявка",
               headerStyle: { backgroundColor: "#32b3be", },
               headerTitleStyle: { fontSize: 25 }, 
               headerTintColor: "white",
              }}
            name="QueryStack"
            component={QueryStack}
          />
          <Stack.Screen
            options={{
              headerShown: true,
              title: "Сброс пароля",
              headerStyle: { backgroundColor: "#32b3be" },
              headerTitleStyle: { fontSize: 25 },
              headerTintColor: "white",
            }}
            name="ForgotPassword"
            component={ForgotPassword}
          />
          <Stack.Screen
            options={{
              headerShown: true,
              title: "Учёт калорий",
              headerStyle: { backgroundColor: "#32b3be" },
              headerTitleStyle: { fontSize: 25 },
              headerTintColor: "white",
            }}
            name="Calorie"
            component={Calorie}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={Login}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Registration"
            component={Registration}
          />
          <Stack.Screen
            options={{
              headerShown: true,
              title: "Сброс пароля",
              headerStyle: { backgroundColor: "#32b3be" },
              headerTitleStyle: { fontSize: 25 },
            }}
            name="ForgotPassword"
            component={ForgotPassword}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="RegistrationNext"
            component={RegistrationNext}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default Navigate;
