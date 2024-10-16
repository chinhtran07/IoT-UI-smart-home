import AddDeviceCard from "@/components/device/AddDeviceCard";
import CardDevice from "@/components/device/CardDevice";
import { API_ENDPOINTS } from "@/configs/apiConfig";
import { Colors } from "@/constants/Colors";
import apiClient from "@/services/apiService";
import { Href, Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";
import { IconButton, Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface Item {
    id: string;
}

interface ResponseData {
    currentPage: number;
    data: Item[];
    total: number;
    totalPages: number;
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 40) / 2;

export default function Index() {
    const [devices, setDevices] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [activeMenu, setActiveMenu] = useState<"right" | "left" | null>(null);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const router = useRouter();

    const fetchDevices = useCallback(async (pageNum: number) => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const res = await apiClient.get<ResponseData>(
                `${API_ENDPOINTS.devices.by_owner}?page=${pageNum}`
            );

            if (res.status === 200) {
                const { data: fetchedDevices, totalPages } = res.data;
                setDevices((prevDevices) => [...prevDevices, ...fetchedDevices]);
                setHasMore(pageNum < totalPages);
            } else {
                showErrorSnackbar("Failed to fetch devices.");
            }
        } catch (error) {
            console.error("Error fetching devices:", error);
            showErrorSnackbar("Error fetching devices.");
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore]);

    useEffect(() => {
        fetchDevices(page);
    }, [page, fetchDevices]);

    const loadMoreDevices = () => {
        if (!loading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const renderDevice = ({ item }: { item: Item }) => (
        <CardDevice
            key={item.id}
            id={item.id}
            style={styles.cardDevice}
            onLongPress={() => router.push(`/devices/${item.id}`)}
        />
    );

    const showErrorSnackbar = (message: string) => {
        setSnackbarVisible(true);
    };

    const handleMenuPress = (route: Href) => {
        router.push(route);
        setActiveMenu(null);
    };

    const toggleMenu = (menu: "right" | "left") => {
        setActiveMenu((prev) => (prev === menu ? null : menu));
    };

    const menuItems = {
        right: [
            { label: "Add Device", route: "/devices/addDevice" },
            { label: "Add Group", route: "/groups/addGroup" },
            { label: "Add Scenario", route: "/scenarios/addScenario" },
            { label: "Add Scene", route: "/scenes/addScene" },
        ],
        left: [
            { label: "Manage Rooms", route: "/groups" },
        ],
    };

    const renderMenu = (menuType: "right" | "left") => (
        <View style={styles[`${menuType}Menu`]}>
            {menuItems[menuType].map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={() => handleMenuPress(item.route as Href)}
                    activeOpacity={0.6}
                >
                    <Text style={styles.menuText}>{item.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "",
                    headerStyle: {
                        backgroundColor: Colors.header.color
                    },
                    headerRight: () => (
                        <View style={styles.headerButtonContainer}>
                            <IconButton
                                icon="plus"
                                size={28}
                                iconColor={Colors.dark.icon}
                                onPress={() => toggleMenu("right")}
                                style={styles.headerButton}
                            />
                            {activeMenu === "right" && renderMenu("right")}
                        </View>
                    ),
                    headerLeft: () => (
                        <View style={styles.headerButtonContainer}>
                            <IconButton
                                icon="menu"
                                size={28}
                                iconColor={Colors.dark.icon}
                                onPress={() => toggleMenu("left")}
                                style={styles.headerButton}
                            />
                            {activeMenu === "left" && renderMenu("left")}
                        </View>
                    ),
                }}
            />
            <FlatList
                data={devices}
                renderItem={renderDevice}
                keyExtractor={(item) => item.id}
                onEndReached={loadMoreDevices}
                onEndReachedThreshold={0.5}
                numColumns={2}
                style={styles.deviceList}
                contentContainerStyle={devices.length === 0 ? styles.emptyList : styles.deviceListContent}
                ListEmptyComponent={<AddDeviceCard />}
            />
            {loading && (
                <ActivityIndicator
                    size="large"
                    color={Colors.light.icon}
                    style={styles.loadingIndicator}
                />
            )}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
            >
                Error fetching devices.
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.light.background,
    },
    rightMenu: {
        position: "absolute",
        right: 10,
        top: 50,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
        zIndex: 2000,
    },
    leftMenu: {
        position: "absolute",
        left: 10,
        top: 50,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
        zIndex: 2000,
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    menuText: {
        fontSize: 18,
        color: Colors.light.text,
        fontWeight: "500",
    },
    deviceList: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        paddingTop: 10,
    },
    deviceListContent: {
        justifyContent: "flex-start",
        paddingBottom: 100,
    },
    emptyList: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingIndicator: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    cardDevice: {
        width: cardWidth,
        margin: 10,
        backgroundColor: Colors.light.background,
        borderRadius: 10,
        elevation: 5,
        overflow: "hidden",
    },
    headerButtonContainer: {
        flexDirection: 'row',
    },
    headerButton: {
        marginHorizontal: 10,
    },
});
