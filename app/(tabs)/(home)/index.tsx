import { router, usePathname } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const pathname = usePathname();
  console.log("pathname:", pathname);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View>
        <TouchableOpacity onPress={() => router.push(`/`)}>
          <Text style={{ color: pathname === "/" ? "orange" : "black" }}>For you</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push(`/following`)}>
          <Text style={{ color: pathname === "/" ? "black" : "orange" }}>Following</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push(`/@jiahn/post/1`)}>
          <Text>post 1</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push(`/@jiahn/post/2`)}>
          <Text>post 2</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
