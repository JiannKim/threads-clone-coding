import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
  RefreshControl,
} from "react-native";
import { usePathname } from "expo-router";
import { useState, useCallback, useEffect, useContext } from "react";
import Post, { Post as PostType } from "../../../components/Post";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { AnimationContext } from "./_layout";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<PostType>);

export default function Index() {
  const colorScheme = useColorScheme();
  const path = usePathname();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { scrollPosition } = useContext(AnimationContext) as {
    scrollPosition: SharedValue<number>;
  };

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPosts([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetch(`/posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, [path]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      scrollPosition.value = event.contentOffset.y;
    },
  });

  return (
    <View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.containerDark : styles.containerLight,
      ]}
    >
      <AnimatedFlashList
        data={posts}
        refreshControl={<View />}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshing={refreshing}
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
