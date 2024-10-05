import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Colors from '@/constants/Colors'; // Import colors

interface Header {
    title: string;
    leftMenuOptions: string[];
    onLeftMenuSelect: (option: string) => void;
    menuItems: { label: string; onPress: () => void }[];
}

const Header: React.FC<Header> = ({ title, leftMenuOptions, onLeftMenuSelect, menuItems }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [leftMenuVisible, setLeftMenuVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(leftMenuOptions[0]);

    const toggleMenu = () => {
        setMenuVisible(prev => {
            if (prev) {
                return false; // Close main menu if open
            } else {
                setLeftMenuVisible(false); // Close left menu
                return true; // Open main menu
            }
        });
    };

    const toggleLeftMenu = () => {
        setLeftMenuVisible(prev => {
            if (prev) {
                return false; // Close left menu if open
            } else {
                setMenuVisible(false); // Close main menu
                return true; // Open left menu
            }
        });
    };

    const changeOption = (option: string) => {
        setSelectedOption(option);
        setLeftMenuVisible(false);
        onLeftMenuSelect(option); // Call the provided function when an option is selected
    };

    return (
        <View style={styles.container}>
            {/* Left Content */}
            <TouchableOpacity style={styles.leftContainer} onPress={toggleLeftMenu}>
                <View style={styles.leftContent}>
                    <Text style={styles.title}>{selectedOption}</Text>
                    <Ionicons name="caret-down" size={15} color={Colors.light.icon} />
                </View>
            </TouchableOpacity>

            {/* Right Icons */}
            <View style={styles.rightIcon}>
                <TouchableOpacity style={styles.iconButton} onPress={toggleMenu}>
                    <Ionicons name="add-sharp" size={24} color={Colors.light.icon} />
                </TouchableOpacity>
            </View>

            {/* Menu - visible when menuVisible is true */}
            {menuVisible && (
                <View style={styles.menu}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={() => { item.onPress(); toggleMenu() }}>
                            <Text style={styles.menuText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Left Menu - visible when leftMenuVisible is true */}
            {leftMenuVisible && (
                <View style={styles.leftMenu}>
                    {leftMenuOptions.map((option, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={() => changeOption(option)}>
                            <Text style={styles.menuText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
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
