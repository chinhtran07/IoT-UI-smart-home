import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";
import React from "react";
import { router } from "expo-router";
import  Colors  from '@/constants/Colors'; // Nhập màu sắc

const Header = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [leftMenuVisible, setLeftMenuVisible] = useState(false);

    const toggleMenu = () => {
        // Nếu menu chính đang mở thì đóng nó, nếu không thì đóng menu bên trái
        setMenuVisible(prev => {
            if (prev) {
                return false; // Đóng menu chính nếu đang mở
            } else {
                setLeftMenuVisible(false); // Đóng menu bên trái
                return true; // Mở menu chính
            }
        });
    };

    const toggleLeftMenu = () => {
        // Nếu menu bên trái đang mở thì đóng nó, nếu không thì đóng menu chính
        setLeftMenuVisible(prev => {
            if (prev) {
                return false; // Đóng menu bên trái nếu đang mở
            } else {
                setMenuVisible(false); // Đóng menu chính
                return true; // Mở menu bên trái
            }
        });
    };

    const goToAddDevice = () => {
        router.replace('/(tabs)/groups/addDevice');
        toggleMenu(); // Đóng menu chính sau khi chọn
    };

    const goToAddGroup = () => {
        router.replace('/(tabs)/groups/addGroup');
        toggleMenu(); // Đóng menu chính sau khi chọn
    };

    return (
        <View style={styles.container}>
            {/* Left Content */}
            <TouchableOpacity style={styles.leftContainer} onPress={toggleLeftMenu}>
                <View style={styles.leftContent}>
                    <Text style={styles.title}>My Home</Text>
                    <Ionicons name="caret-down" size={15} color={Colors.light.icon} />
                </View>
            </TouchableOpacity>

            {/* Right Icons */}
            <View style={styles.rightIcon}>
                <TouchableOpacity style={styles.iconButton} onPress={toggleMenu}>
                    <Ionicons name="add-sharp" size={24} color={Colors.light.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <AntDesign name="appstore-o" size={24} color={Colors.light.icon} />
                </TouchableOpacity>
            </View>

            {/* Menu - visible when menuVisible is true */}
            {menuVisible && (
                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuItem} onPress={goToAddDevice}>
                        <Text style={styles.menuText}>Add Device</Text>
                    </TouchableOpacity>
                    <View style={{ borderWidth: 1 }} />
                    <TouchableOpacity style={styles.menuItem} onPress={goToAddGroup}>
                        <Text style={styles.menuText}>Add Group</Text>
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
        backgroundColor: Colors.light.background,
        borderBottomColor: Colors.light.icon,
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
        color: Colors.light.text,
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
        right: 20,
        top: 60,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        elevation: 5,
        zIndex: 2000,
    },
    leftMenu: {
        position: 'absolute',
        left: 15,
        top: 60,
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
        color: Colors.light.text,
    },
});

export default Header;
