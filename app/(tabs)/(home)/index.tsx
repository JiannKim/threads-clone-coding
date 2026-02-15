import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from "react-native";
import { usePathname } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import Post, { Post as PostType } from "../../../components/Post";
import { FlashList } from "@shopify/flash-list";

export default function Index() {
  const colorScheme = useColorScheme();
  const path = usePathname();
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    fetch(`/posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      })
      .catch(console.error);
  }, [path]);

  const onEndReached = useCallback(() => {
    const lastId = posts.at(-1)?.id;
    if (!lastId) return;

    fetch(`/posts?cursor=${lastId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.posts.length > 0) {
          setPosts((prev) => [...prev, ...data.posts]);
        }
      })
      .catch(console.error);
  }, [posts, path]);

  return (
    <View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.containerDark : styles.containerLight,
      ]}
    >
      <FlashList
        data={posts}
        renderItem={({ item }) => <Post item={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "#101010",
  },
  textLight: {
    color: "black",
  },
  textDark: {
    color: "white",
  },
});
