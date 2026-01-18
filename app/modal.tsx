import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Image,
  StyleSheet,
  Platform,
  Modal as RNModal,
  Linking,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";

interface Thread {
  id: string;
  text: string;
  hashtag?: string;
  location?: [number, number];
  imageUris: string[];
}

export function ListFooter({
  canAddThread,
  addThread,
}: {
  canAddThread: boolean;
  addThread: () => void;
}) {
  return (
    <View style={styles.listFooter}>
      <View style={styles.listFooterAvatar}>
        <Image
          source={require("../assets/images/avatar.png")}
          style={styles.avatarSmall}
        />
      </View>
      <View>
        <Pressable onPress={addThread} style={styles.input}>
          <Text style={{ color: canAddThread ? "#999" : "#ccc", paddingBottom: 4 }}>
            스레드에 추가
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function Modal() {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([
    { id: Date.now().toString(), text: "", imageUris: [] },
  ]);
  const [topicText, setTopicText] = useState("");
  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});
  const flatListRef = useRef<FlatList>(null);
  const [newlyAddedThreadId, setNewlyAddedThreadId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const [replyOption, setReplyOption] = useState("Anyone");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const replyOptions = ["Anyone", "Profiles you follow", "Mentioned only"];

  const handleCancel = () => {
    if (isPosting) return;
    router.back();
  };

  const handlePost = () => {};

  const updateThreadText = (id: string, text: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id ? { ...thread, text } : thread
      )
    );
  };

  const canAddThread = (threads.at(-1)?.text.trim().length ?? 0) > 0;
  const canPost = threads.every((thread) => thread.text.trim().length > 0);

  const addImageToThread = (id: string, uri: string) => {};

  const addLocationToThread = (id: string, location: [number, number]) => {};

  const removeThread = (id: string) => {
    setThreads((prevThreads) =>
      prevThreads.filter((thread) => thread.id !== id)
    );
  };

  const pickImage = async (id: string) => {};

  const takePhoto = async (id: string) => {};

  const removeImageFromThread = (id: string, uriToRemove: string) => {};

  const getMyLocation = async (id: string) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log("getMyLocation", status);
    if (status !== "granted") {
      Alert.alert(
        "Location permission not granted",
        "Please grant location permission to use this feature",
        [
          {
            text: "Open settings",
            onPress: () => {
              Linking.openSettings();
            },
          },
          {
            text: "Cancel",
          },
        ]
      );
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              location: [location.coords.latitude, location.coords.longitude],
            }
          : thread
      )
    );
  };

  // 스레드가 추가되면 자동으로 최하단으로 스크롤 및 포커스
  useEffect(() => {
    if (newlyAddedThreadId) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
      
      setTimeout(() => {
        inputRefs.current[newlyAddedThreadId]?.focus();
        setNewlyAddedThreadId(null);
      }, 100);
    }
  }, [newlyAddedThreadId]);

  const renderThreadItem = ({
    item,
    index,
  }: {
    item: Thread;
    index: number;
  }) => (
    <View style={styles.threadContainer}>
      <View style={styles.avatarContainer}>
        <Image
          source={require("../assets/images/avatar.png")}
          style={styles.avatar}
        />
        <View style={styles.threadLine} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoUsernameContainer}>
            <Text style={styles.username}>dominica.world</Text>
            <Ionicons name="chevron-forward-outline" size={14} color="#8e8e93" />
            {index === 0 ? (
              <View style={styles.topicContainer}>
                <TextInput style={styles.topicText} value={topicText} onChangeText={(text) => setTopicText(text)} placeholder="주제 추가"
                  placeholderTextColor="#999"
                  multiline={false}
              />
                {threads.length > 1 && (
                  <Text style={styles.topicIndexLabel}>{index + 1 }/{threads.length}</Text>
                )}
              </View>
            ) : (
              <View style={styles.topicContainer}>
                <Text style={[styles.topicText, { color: "#8e8e93" }]}>{topicText}</Text>
                {threads.length > 1 && (
                  <Text style={styles.topicIndexLabel}>{index + 1 }/{threads.length}</Text>
                )}
              </View>
            )}
          </View>
          {index > 0 && (
            <Pressable
            onPress={() => removeThread(item.id)}
              style={styles.removeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-outline" size={20} color="#8e8e93" />
            </Pressable>
          )}
        </View>
        { index === 0 ? (
            <TextInput
              style={styles.input}
              placeholder={"새로운 소식이 있나요?"}
              placeholderTextColor="#999"
              value={item.text}
              onChangeText={(text) => updateThreadText(item.id, text)}
              multiline
            />
        ) : 
        <TextInput
          ref={(ref) => {
            inputRefs.current[item.id] = ref;
          }}
          style={styles.input}
          placeholder={"내용을 더 추가해보세요..."}
          placeholderTextColor="#999"
          value={item.text}
          onChangeText={(text) => updateThreadText(item.id, text)}
          multiline
          />
        }
        {item.imageUris && item.imageUris.length > 0 && (
          <FlatList
            data={item.imageUris}
            renderItem={({ item: uri, index: imgIndex }) => (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <Pressable
                  onPress={() =>
                    !isPosting && removeImageFromThread(item.id, uri)
                  }
                  style={styles.removeImageButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color="rgba(0,0,0,0.7)"
                  />
                </Pressable>
              </View>
            )}
            keyExtractor={(uri, imgIndex) =>
              `${item.id}-img-${imgIndex}-${uri}`
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageFlatList}
          />
        )}
        {item.location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              {item.location[0]}, {item.location[1]}
            </Text>
          </View>
        )}
        <View style={styles.actionButtons}>
          <Pressable
            style={styles.actionButton}
            onPress={() => !isPosting && pickImage(item.id)}
          >
            <Ionicons name="image-outline" size={24} color="#777" />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => !isPosting && takePhoto(item.id)}
          >
            <Ionicons name="camera-outline" size={24} color="#777" />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              getMyLocation(item.id);
            }}
          >
            <FontAwesome name="map-marker" size={24} color="#777" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={handleCancel} disabled={isPosting}>
          <Text style={[styles.cancel, isPosting && styles.disabledText]}>
            Cancel
          </Text>
        </Pressable>
        <Text style={styles.title}>New thread</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <FlatList
        ref={flatListRef}
        data={threads}
        keyExtractor={(item) => item.id}
        renderItem={renderThreadItem}
        ListFooterComponent={
          <ListFooter
            canAddThread={canAddThread}
            addThread={() => {
              if (canAddThread) {
                const newId = Date.now().toString();
                setThreads((prevThreads) => [
                  ...prevThreads,
                  { id: newId, text: "", imageUris: [] },
                ]);
                setNewlyAddedThreadId(newId);
              }
            }}
          />
        }
        style={styles.list}
        contentContainerStyle={{
          backgroundColor: "#fff",
         }}
        keyboardShouldPersistTaps="handled"
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <Pressable onPress={() => setIsDropdownVisible(true)}>
          <Text style={styles.footerText}>{replyOption} can reply & quote</Text>
        </Pressable>
        <Pressable
          style={[styles.postButton, !canPost && styles.postButtonDisabled]}
          disabled={!canPost}
          onPress={handlePost}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  headerRightPlaceholder: {
    width: 60,
  },
  cancel: {
    color: "#000",
    fontSize: 16,
  },
  disabledText: {
    color: "#ccc",
  },
  title: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    flex: 1,
    marginBottom: 88,
  },
  threadContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  avatarContainer: {
    alignItems: "center",
    marginRight: 12,
    paddingTop: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#555",
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#555",
  },
  threadLine: {
    width: 1.2,
    flexGrow: 1,
    backgroundColor: "#aaa",
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 6,
  },
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  username: {
    fontWeight: "600",
    fontSize: 15,
    color: "#000",
  },
  input: {
    fontSize: 15,
    color: "#000",
    paddingTop: 4,
    paddingBottom: 8,
    minHeight: 24,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginRight: 15,
  },
  imageFlatList: {
    marginTop: 12,
    marginBottom: 4,
  },
  imagePreviewContainer: {
    position: "relative",
    marginRight: 8,
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    color: "#8e8e93",
    fontSize: 14,
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: "#000",
    borderRadius: 18,
  },
  postButtonDisabled: {
    backgroundColor: "#ccc",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: "hidden",
    marginBottom: 5,
  },
  dropdownOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5e5",
  },
  selectedOption: {},
  dropdownOptionText: {
    fontSize: 16,
    color: "#000",
  },
  selectedOptionText: {
    fontWeight: "600",
    color: "#007AFF",
  },
  removeButton: {
    padding: 4,
    marginRight: -4,
    marginLeft: 8,
  },
  listFooter: {
    paddingLeft: 26,
    paddingTop: 10,
    flexDirection: "row",
  },
  listFooterAvatar: {
    marginRight: 20,
    paddingTop: 2,
  },
  locationContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#8e8e93",
  },
  userInfoUsernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  topicContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  topicText: {
    fontSize: 14,
  },
  topicIndexLabel: {
    fontSize: 14,
    backgroundColor: "#f0f0f0",
    color: "#8e8e93",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    letterSpacing: 0.8,
  },
});
