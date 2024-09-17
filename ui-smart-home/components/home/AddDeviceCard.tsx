import React from "react";
import { StyleSheet, TouchableOpacity, View, Text, Dimensions } from "react-native";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const AddDeviceCard = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.iconWrapper}>
          <Ionicons name="add" size={40} color="white" />
        </View>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.text}>Add Device</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 3;

const styles = StyleSheet.create({
  container: {
    width: '50%',
    padding: 10,
  },
  card: {
    borderRadius: 10, // Consistent border radius
    aspectRatio: 1, // Maintain square aspect ratio
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Similar background to CustomCard
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker background for icon
    borderRadius: 30, // Rounded icon container
    padding: 10,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  cardContent: {
    justifyContent: 'center', // Center content
    alignItems: 'center', // Center content
    padding: 10,
  },
  text: {
    color: 'white', // Consistent text color
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AddDeviceCard;
