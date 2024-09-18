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
    borderRadius: 10, 
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255, 0.2)', 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    borderRadius: 30, 
    padding: 10,
    position: 'absolute',
    bottom: 40,
    // left: 10,
  },
  cardContent: {
    bottom: -60, 
    alignItems: 'center', 
    padding: 10,
    right: 20
    
  },
  text: {
    color: 'white', 
    fontSize: 20,
    textAlign: 'center',
    fontWeight: "700"
  },
});

export default AddDeviceCard;
