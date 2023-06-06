import React from "react";
import { NavigationContainer } from "@react-navigation/native";
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
import CalorieDay from "../Screens/CalorieDay";
import Chat from "../Screens/Chat";
import Workouts from "../Screens/Workouts";

const Stack = createNativeStackNavigator();

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
              headerStyle: { backgroundColor: "#32b3be" },
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
              headerStyle: { backgroundColor: "#32b3be" },
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
              headerStyle: { backgroundColor: "#32b3be" },
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
          <Stack.Screen
            options={{
              headerShown: true,
              title: "Учёт калорий",
              headerStyle: { backgroundColor: "#32b3be" },
              headerTitleStyle: { fontSize: 25 },
              headerTintColor: "white",
            }}
            name="CalorieDay"
            component={CalorieDay}
          />
          <Stack.Screen
            options={{
              headerShown: true,
              title: "Чат",
              headerStyle: { backgroundColor: "#32b3be" },
              headerTitleStyle: { fontSize: 25 },
              headerTintColor: "white",
            }}
            name="Chat"
            component={Chat}
          />
          <Stack.Screen
            options={{
              headerShown: true,
              title: "Индивидуальная тренировка",
              headerStyle: { backgroundColor: "#32b3be" },
              headerTitleStyle: { fontSize: 25 },
              headerTintColor: "white",
            }}
            name="Workouts"
            component={Workouts}
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
              headerTintColor: "white",
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
