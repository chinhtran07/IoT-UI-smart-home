import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import Colors from "@/constants/Colors"; // Import Colors from the specified path
import apiClient from "@/services/apiService";
import { API_ENDPOINTS } from "@/configs/apiConfig";

interface Group {
  _id: string;
  name: string;
  image: string;
}

interface GroupItemProps {
  group: Group;
  onPress: (id: string) => void;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, onPress }) => (
  <TouchableOpacity onPress={() => onPress(group._id)} style={styles.card}>
    <View style={styles.groupItem}>
      <Image source={{ uri: group.image }} style={styles.groupImage} />
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{group.name}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const GroupListScreen: React.FC = () => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Groups</Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/groups/addGroup")}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={24} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <GroupItem group={item} onPress={handleGroupPress} />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50, 
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  addButton: {
    padding: 5,
  },
  listContainer: {
    padding: 20,
  },
  card: {
    marginBottom: 15,
    backgroundColor: Colors.light.background || '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    padding: 10,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.light.text,
  },
});

export default GroupListScreen;
