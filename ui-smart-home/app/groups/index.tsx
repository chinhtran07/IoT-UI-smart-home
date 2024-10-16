import { API_ENDPOINTS } from "@/configs/apiConfig";
import { Colors } from "@/constants/Colors";
import apiClient from "@/services/apiService";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface Group {
  id: string;
  name: string;
  icon: string;
}

interface GroupItemProps {
  group: Group;
  onPress: (id: string) => void;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, onPress }) => (
  <TouchableOpacity onPress={() => onPress(group.id)} style={styles.card}>
    <View style={styles.groupItem}>
      <Image source={{ uri: group.icon }} style={styles.groupImage} />
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{group.name}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function Index() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);

  // Fetch groups using useCallback
  const fetchGroups = useCallback(async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.groups.all_groups);
      if (res.status === 200) {
        setGroups(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  }, []);

  // useFocusEffect to fetch groups when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [fetchGroups])
  );

  const handleGroupPress = (id: string) => {
    router.push(`/groups/${id}`);
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Empty</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Group",
          headerBackVisible: true,
          headerTitleAlign: "center",
          headerTintColor: Colors.dark.text,
          headerStyle: {
            backgroundColor: Colors.header.color,
          },
          headerRight: () => (
            <IconButton
              icon={() => <Ionicons name="add-circle" size={24} color={Colors.light.tint} />}
              onPress={() => router.push("/groups/addGroup")}
              style={styles.addButton}
            />
          ),
        }}
      />

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupItem group={item} onPress={handleGroupPress} />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
        ListEmptyComponent={renderEmptyComponent()} // Add empty component
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContainer: {
    padding: 20,
  },
  card: {
    marginBottom: 15,
    backgroundColor: Colors.light.background || '#fff', // Dynamic background color
    borderRadius: 12, // Rounded corners
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.22,
    elevation: 3, // Slightly stronger shadow
    padding: 15,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupImage: {
    width: 60, // Increased size for better visibility
    height: 60,
    borderRadius: 30, // Make it circular
    marginRight: 15,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.light.text,
  },
  addButton: {
    marginRight: 10,
    backgroundColor: "transparent", // Transparent background for button
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
  },
});
