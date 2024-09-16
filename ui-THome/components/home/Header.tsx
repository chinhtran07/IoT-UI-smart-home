import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";

const Header = () => {

    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <View style={styles.container}>
             <TouchableOpacity style={styles.leftContainer}>
                <View style={styles.leftContent}>
                    <Text style={styles.title}>My Home</Text>
                    <Ionicons name="caret-down" size={15} color="white" />
                </View>
            </TouchableOpacity>

            <View style={styles.rightIcon}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="add-sharp" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <AntDesign name="appstore-o" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'transparent',
        borderBottomColor: '#ccc'
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        color: '#fff',
        marginRight: 5,
    },
    rightIcon: {
        flexDirection: "row",
    },
    iconButton: {
        marginLeft: 15
    },
});

export default Header;