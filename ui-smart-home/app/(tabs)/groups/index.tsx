import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import  Colors  from "@/constants/Colors"; // Import Colors from the specified path

interface Group {
  id: string;
  name: string;
  description: string;
  image: string;
}

const groupData: Group[] = [
  { id: '1', name: 'Group 1', description: 'Description for group 1', image: 'https://via.placeholder.com/100' },
  { id: '2', name: 'Group 2', description: 'Description for group 2', image: 'https://via.placeholder.com/100' },
  { id: '3', name: 'Group 3', description: 'Description for group 3', image: 'https://via.placeholder.com/100' },
  { id: '4', name: 'Group 4', description: 'Description for group 4', image: 'https://via.placeholder.com/100' },
];

interface GroupItemProps {
  group: Group;
  onPress: (id: string) => void;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, onPress }) => (
  <TouchableOpacity onPress={() => onPress(group.id)} style={styles.card}>
    <View style={styles.groupItem}>
      <Image source={{ uri: group.image }} style={styles.groupImage} />
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.groupDescription}>{group.description}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const GroupListScreen: React.FC = () => {
  const router = useRouter();

  const handleGroupPress = (id: string) => {
    router.push(`/groups/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View></View>
        <Text style={styles.headerTitle}>Groups</Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/(tabs)/groups/addGroup");
          }}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={24} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={groupData}
        keyExtractor={(item) => item.id}
        numColumns={1}
        renderItem={({ item }) => <GroupItem group={item} onPress={handleGroupPress} />}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, // Use background color from Colors
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
    color: Colors.light.text, // Updated header title color
  },
  addButton: {
    padding: 5,
  },
  listContainer: {
    padding: 20,
  },
  card: {
    marginBottom: 15,
    backgroundColor: Colors.light.background || '#fff', // Use a new property for card background if defined
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
    color: Colors.light.text, // Updated group name color
  },
  groupDescription: {
    color: Colors.light.icon || '#666', // Use icon color for description
    fontSize: 14,
  },
});

export default GroupListScreen;
