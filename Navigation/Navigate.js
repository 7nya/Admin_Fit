import React from "react";
import { Image, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigate from "./TabNavigate";
import Login from "../Screens/Login";
import useAuth from "../AuthHook/useAuth";
import Registration from "../Screens/Registration";
import ForgotPassword from "../Screens/ForgotPassword";
import PersonStack from "../Screens/PersonStack";
import { UserDetailsScreen } from "../Screens/Person";
import RegistrationNext from "../Screens/RegistrationNext";

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
              }}
            name="PersonStack"
            component={PersonStack}
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
