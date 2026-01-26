import {
  type MaterialTopTabNavigationEventMap,
  type MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import type {
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import { Pressable, View, Image, Text , StyleSheet } from "react-native";
import { useState , useContext } from "react";
import { AuthContext } from "../../_layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SideMenu from "../../../components/SideMenu";
const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        {isLoggedIn && (
          <Pressable
            style={styles.menuButton}
            onPress={() => {
              setIsSideMenuOpen(true);
            }}
          >
            <Ionicons name="menu" size={24} color="black" />
          </Pressable>
        )}
        <SideMenu
          isVisible={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
        />
      </View>
      <View style={styles.profile}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user?.profileImageUrl }}
            style={styles.profileAvatar}
          />
          <View style={styles.profileInfo}>
            <Text>{user?.name}</Text>
            <Text>{user?.id}</Text>
            <Text>{user?.description}</Text>
          </View>
        </View>
      </View>
      <View style={styles.tabsContainer}>
        <MaterialTopTabs
          screenOptions={{
            lazy: true,
            swipeEnabled: true,
            tabBarStyle: {
              backgroundColor: "white",
              shadowColor: "transparent",
              position: "relative",
            },
            tabBarPressColor: "transparent",
            tabBarActiveTintColor: "#555",
            tabBarIndicatorStyle: {
              backgroundColor: "black",
              height: 1,
            },
            tabBarIndicatorContainerStyle: {
              backgroundColor: "#aaa",
              position: "absolute",
              top: 48,
              height: 1,
            },
          }}
        >
          <MaterialTopTabs.Screen name="index" options={{ title: "Threads" }} />
          <MaterialTopTabs.Screen name="replies" options={{ title: "Replies" }} />
          <MaterialTopTabs.Screen name="reposts" options={{ title: "Reposts" }} />
        </MaterialTopTabs>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  menuButton: {
    padding: 8,
  },
  profile: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileInfo: {
    flex: 1,
    gap: 3,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tabsContainer: {
    flex: 1,
  },
});