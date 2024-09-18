import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import CustomCard from "@/components/CustomCard"; // Đảm bảo đường dẫn chính xác

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
  return (
    <View style={styles.container}>
      <FlatList
        data={groupData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <GroupItem group={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 15,
  },
});

export default GroupListScreen;
