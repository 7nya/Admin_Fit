import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { getDoc, doc } from "firebase/firestore";

import { auth, firestore } from "../firebase";

export default useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, `instructors/${user.uid}`);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({ ...user, ...userData });
        } else {
          setUser(user);
        }
      } else {
        setUser(null);
      }
    });

    return unsub;
  }, []);

  return { user };
};
