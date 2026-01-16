import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
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
            },
        }}>
            <Tabs.Screen name="index" options={{
                title: "Home",
                tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" color={color} size={size} />
            ),
            }} />
            <Tabs.Screen name="search" options={{
                title: "Search",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="search" color={color} size={size} />
            ),
            }} />
            <Tabs.Screen name="add"
                listeners={() => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        router.navigate("/modal");
                    },
                })}
                options={{
                title: "Add",
                tabBarIcon: ({ color, size }) => (
                <Ionicons name="add" color={color} size={size} />
            ),
            }}   /> 
            <Tabs.Screen name="activity" options={{
            title: "Activity",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="heart-outline" color={color} size={size} />
            ),
            }} />
            <Tabs.Screen name="[username]" options={{
            title: "User",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" color={color} size={size} />
            ),
            }} />
        </Tabs>
    );
}