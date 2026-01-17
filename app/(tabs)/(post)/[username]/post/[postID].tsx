import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Post() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>게시글 상세 페이지 입니다.</Text>
      <Pressable onPress={() => router.back()}>
        <Text>Close</Text>
      </Pressable>
    </View>
  );
}
