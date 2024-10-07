import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Appbar, Text } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import Colors from "@/constants/Colors"; // Import Colors from the specified path
import apiClient from "@/services/apiService";
import { API_ENDPOINTS } from "@/configs/apiConfig";

interface Group {
  _id: string;
  name: string;
  icon: string;
}

interface GroupItemProps {
  group: Group;
  onPress: (id: string) => void;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, onPress }) => (
  <TouchableOpacity onPress={() => onPress(group._id)} style={styles.card}>
    <View style={styles.groupItem}>
      <Image source={{ uri: group.icon }} style={styles.groupImage} />
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
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="Groups" titleStyle={styles.appBarTitle} />
        <Appbar.Action
          icon={() => <Ionicons name="add-circle" size={24} color={Colors.light.tint} />}
          onPress={() => router.push("/(tabs)/groups/addGroup")}
        />
      </Appbar.Header>

      <FlatList
        data={groups}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <GroupItem group={item} onPress={handleGroupPress} />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  appBar: {
    backgroundColor: '#94D9F1', // Set a default color if needed
  },
  appBarTitle: {
    color: Colors.light.text,
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
