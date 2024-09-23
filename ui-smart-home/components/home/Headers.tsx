import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";
import React from "react";
import { router } from "expo-router";

const Header = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [leftMenuVisible, setLeftMenuVisible] = useState(false);

    const toggleMenu = () => setMenuVisible(!menuVisible);
    const toggleLeftMenu = () => setLeftMenuVisible(!leftMenuVisible);

    const goToAddDevice = () => {
        router.replace('/(tabs)/groups/addDevice');
        toggleMenu();
    };

    const goToAddGroup = () => {
        router.replace('/(tabs)/groups/addGroup');
        toggleMenu();
    }

    return (
        <View style={styles.container}>
            {/* Left Content */}
            <TouchableOpacity style={styles.leftContainer} onPress={toggleLeftMenu}>
                <View style={styles.leftContent}>
                    <Text style={styles.title}>My Home</Text>
                    <Ionicons name="caret-down" size={15} color="white" />
                </View>
            </TouchableOpacity>

            {/* Right Icons */}
            <View style={styles.rightIcon}>
                <TouchableOpacity style={styles.iconButton} onPress={toggleMenu}>
                    <Ionicons name="add-sharp" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <AntDesign name="appstore-o" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Menu - visible when menuVisible is true */}
            {menuVisible && (
                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => goToAddDevice()}>
                        <Text style={styles.menuText}>Add Device</Text>
                    </TouchableOpacity>
                    <View style={{ borderWidth: 1 }} />
                    <TouchableOpacity style={styles.menuItem} onPress={() => goToAddGroup()}>
                        <Text style={styles.menuText}>Add group</Text>
                    </TouchableOpacity>
                    <View style={{ borderWidth: 1 }} />
                    <TouchableOpacity style={styles.menuItem} onPress={toggleMenu}>
                        <Text style={styles.menuText}>Add Automation</Text>
                    </TouchableOpacity>
                </View>
            )}

            {leftMenuVisible && (
                <View style={styles.leftMenu}>
                    <TouchableOpacity style={styles.menuItem} onPress={toggleLeftMenu}>
                        <Text style={styles.menuText}>Home 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={toggleLeftMenu}>
                        <Text style={styles.menuText}>Home 2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={toggleLeftMenu}>
                        <Text style={styles.menuText}>Home 3</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'transparent',
        borderBottomColor: '#ccc',
        position: 'relative',
        zIndex: 10,
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
        marginLeft: 15,
    },
    // Menu styles
    menu: {
        position: 'absolute',
        right: 20, // Align menu under "+" icon
        top: 60, // Position under header
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        elevation: 5, // Add shadow for Android
        zIndex: 2000, // Ensure the menu is on top
    },
    leftMenu: {
        position: 'absolute',
        left: 15, // Positioning it under "My Home"
        top: 60, // Positioned under header
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        elevation: 5,
        zIndex: 2000,
    },
    menuItem: {
        paddingVertical: 10,
    },
    menuText: {
        fontSize: 16,
        color: '#000',
    },
});

export default Header;
