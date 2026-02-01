import { Redirect, router } from "expo-router";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./_layout";
import { useContext } from "react";

export default function Login() {
  const insets = useSafeAreaInsets();
  const { user, login } = useContext(AuthContext);
  const isLoggedIn = !!user;

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }
  return (
    <View style={[styles.loginContainer, { paddingTop: insets.top }]}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text>Back</Text>
      </Pressable>
      <View style={styles.loginButtonContainer}>
        <Pressable style={styles.loginButton} onPress={login}>
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
  },
  backButton: {
    width: 80,
    justifyContent: "center",
    padding: 20,
  },
  loginButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    padding: 20,
  },
  loginButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: "center",
  },
  loginButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});
