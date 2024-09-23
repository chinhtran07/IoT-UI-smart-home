import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import CustomCard from "@/components/CustomCard"; // Đảm bảo đường dẫn chính xác
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router"; // Sử dụng useRouter từ expo-router
import { Ionicons } from '@expo/vector-icons'; // Import icon

interface Group {
  id: string;
  name: string;
  description: string;
}

const groupData: Group[] = [
  { id: '1', name: 'Group 1', description: 'Description for group 1' },
  { id: '2', name: 'Group 2', description: 'Description for group 2' },
  { id: '3', name: 'Group 3', description: 'Description for group 3' },
  { id: '4', name: 'Group 4', description: 'Description for group 4' },
];

interface GroupItemProps {
  group: Group;
}

const GroupItem: React.FC<GroupItemProps> = ({ group }) => (
  <CustomCard
    title={group.name}
    paragraph={group.description}
    image="assets/images/group-icon.png" // Đảm bảo bạn có icon hoặc đường dẫn hợp lệ
    style={styles.card}
  />
);

const GroupListScreen: React.FC = () => {
  const router = useRouter();

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
          <Ionicons name="add-circle" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={groupData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <GroupItem group={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50, // Điều chỉnh chiều cao nếu cần
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5', // Màu nền header
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  addButton: {
    padding: 5,
  },
  listContainer: {
    padding: 20,
  },
  card: {
    marginBottom: 15,
  },
});

export default GroupListScreen;
