import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useState } from "react";
import { Modal,Pressable, Text, View } from "react-native";

export default function TabsLayout() {
  const isLoggedIn = true;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            display: "flex",
            backgroundColor: "black",
            borderTopWidth: 0,
            height: 80,
            paddingTop: 10,
            paddingBottom: 10,
            paddingHorizontal: 20,
            borderRadius: 100,
            overflow: "hidden",
            position: "absolute",
            marginHorizontal: 20,
            marginBottom: 20,
          },
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            paddingVertical: 10,
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} color={focused ? "white" : color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "search" : "search-sharp"} color={focused ? "white" : color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
              if (isLoggedIn) {
                router.navigate("/modal");
              } else {
                openLoginModal();
              }
            },
          })}
          options={{
            title: "Add",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          listeners={{
            tabPress: (e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                openLoginModal();
              }
            },
          }}
          options={{
            title: "Activity",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "heart" : "heart-outline"} color={focused ? "white" : color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="[username]"
          listeners={{
            tabPress: (e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                openLoginModal();
              }
            },
          }}
          options={{
            title: "User",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} color={focused ? "white" : color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="(post)/[username]/post/[postID]"
          options={{
            title: "Post",
            href: null,
          }}
        />
      </Tabs>
      <Modal
        visible={isLoginModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={closeLoginModal}
      >
        <View
          style={{
            flex: 1, justifyContent: "flex-end", width: "100%", height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View style={{ 
            backgroundColor: "white",
            padding: 20,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            width: "100%",
            height: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text>Login 하세요.</Text>
          <Pressable onPress={closeLoginModal}>
            <Text>Close</Text>
          </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
