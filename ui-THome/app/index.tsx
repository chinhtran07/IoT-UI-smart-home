import CustomCard from "@/components/CustomCard";
import Header from "@/components/home/Header";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Dimensions, Text } from "react-native";
import { Card } from "react-native-paper";

export default function Index() {
  const [devices, setDevices] = useState([1,]);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <View style={styles.deviceListContainer}>
          {devices.length > 0 ? (
            devices.map((device, index) => (
              <CustomCard key={index} image="assets/images/light-bulb.png" />
            ))
          ) : (
            <AddDeviceCard />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const AddDeviceCard = () => {
  return (
    <TouchableOpacity>
      <View style={styles.cardContainer}>
        <Card style={styles.card}>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Ionicons name="add" size={30} color="white" />
            </View>
          </View>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.text}>Add Devices</Text>
          </Card.Content>
        </Card>
      </View>
    </TouchableOpacity>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#354F63',
  },
  deviceListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  cardContainer: {
    width: cardWidth,
    padding: 10,
  },
  card: {
    width: '100%', // Chi
    aspectRatio: 1, // Đặt aspect ratio để card hình vuông
    borderRadius: 10, // Bo góc
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Màu đen đục
    justifyContent: 'flex-end', // Đẩy content xuống dưới cùng
    position: 'relative', // Để icon không bị đẩy theo content
  },
  iconContainer: {
    position: 'absolute',
    top: -cardWidth + 70,
    left: 20,
    marginTop: 10
  },
  iconWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Nền đậm hơn
    borderRadius: 25, // Bo tròn
    padding: 8,
  },
  cardContent: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingBottom: 10, // Thêm khoảng cách phía dưới cho content
  },
  text: {
    color: 'white', // Màu chữ trắng
    fontSize: 30,
  },
});

