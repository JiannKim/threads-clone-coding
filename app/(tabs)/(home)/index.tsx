import { router, usePathname } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

export default function Index() {
  const pathname = usePathname();
  console.log("pathname:", pathname);

  const isLoggedIn = false;
  return (
    <SafeAreaView style={styles.container}>
      <BlurView intensity={70} style={styles.header}>
        <Image
          source={require("../../../assets/images/react-logo.png")}
          style={styles.logo}
        />
        {!isLoggedIn && (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.navigate(`/login`)}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}
      </BlurView>
      {isLoggedIn && (
        <View style={styles.tabContainer}>
          <View style={styles.tab}>
            <TouchableOpacity onPress={() => router.navigate(`/`)}>
              <Text style={{ color: pathname === "/" ? "orange" : "black" }}>
                For you
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tab}>
            <TouchableOpacity onPress={() => router.navigate(`/following`)}>
              <Text style={{ color: pathname === "/" ? "white" : "orange" }}>
                Following
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View>
        <TouchableOpacity onPress={() => router.navigate(`/@jiahn/post/1`)}>
          <Text>post 1</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.navigate(`/@jiahn/post/2`)}>
          <Text>post 2</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 80,
    paddingVertical: 15,
    borderWidth: 1,
    position: "relative",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    padding: 20,
    backgroundColor: "black",
  },
  tab: {
    padding: 3,
  },
  logo: {
    width: 50,
    height: 50,
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -25 }],
    borderWidth: 1,
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "black",
    borderRadius: 10,
    position: "absolute",
    right: 16,
    borderWidth: 1,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
