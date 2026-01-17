import { Redirect, router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Login() {
    const isLoggedIn = false;
    if (isLoggedIn) {
        return <Redirect href="/(tabs)" />;
    }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login</Text>
      <Pressable onPress={() => router.back()}>
        <Text>Close</Text>
      </Pressable>
    </View>
  );
}