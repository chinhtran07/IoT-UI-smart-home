import { API_ENDPOINTS } from "@/configs/apiConfig";
import { Colors } from "@/constants/Colors";
import apiClient from "@/services/apiService";
import { AntDesign } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { TouchableOpacity, View, StyleSheet, FlatList, ActivityIndicator, Animated, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import debounce from "lodash.debounce";

interface Group {
    id: string;
    name: string;
    icon?: string;
}

interface Device {
    id: string;
    name: string;
}

export default function Index() {
    const [isVisible, setIsVisible] = useState(false);
    const [groups, setGroups] = useState<Group[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedGroup, setSelectedGroup] = useState("All");
    const [pageNum, setPageNum] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const screenWidth = Dimensions.get("window").width;
    const itemWidth = (screenWidth - 60) / 2;

    // Fetch groups on mount
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const { status, data } = await apiClient.get(API_ENDPOINTS.groups.all_groups);
                if (status === 200) {
                    setGroups([{ id: "all", name: "All" }, ...data]);
                }
            } catch (error) {
                console.error("Failed to fetch groups:", error);
            }
        };
        fetchGroups();
    }, []);

    // Fetch devices by page and group, debounced for efficiency
    const fetchDevices = useCallback(
        debounce(async (groupId: string, page: number) => {
            try {
                setIsLoading(true);
                const endpoint =
                    groupId === "All"
                        ? `${API_ENDPOINTS.devices.by_owner}?page=${page}`
                        : API_ENDPOINTS.groups.get_devices_by_group(groupId);

                const { status, data } = await apiClient.get(endpoint);
                if (status === 200) {
                    if (groupId === "All") {
                        setDevices((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
                        setHasMore(data.data.length > 0);
                    } else {
                        setDevices(data);
                        setHasMore(false); // Assume no pagination for group devices
                    }
                }
            } catch (error) {
                console.error("Failed to fetch devices:", error);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        []
    );

    // Initial fetch of devices
    useEffect(() => {
        fetchDevices("All", 1);
    }, []);

    // Handle group selection and reset devices for that group
    const handleGroupSelect = (group: Group) => {
        setSelectedGroup(group.name);
        setPageNum(1); // Reset pagination for new group
        fetchDevices(group.name, 1);
        toggleGroupSelection();
    };

    const toggleGroupSelection = () => setIsVisible((prev) => !prev);

    const renderGroupButton = useCallback(
        (group: Group) => (
            <TouchableOpacity
                key={group.id}
                style={[styles.roomButton, selectedGroup === group.name && styles.activeGroupButton]}
                onPress={() => handleGroupSelect(group)}
            >
                <Text style={[styles.roomButtonText, selectedGroup === group.name && styles.activeGroupText]}>
                    {group.name}
                </Text>
            </TouchableOpacity>
        ),
        [selectedGroup]
    );

    // Load more devices when reaching the end of the list
    const loadMoreDevices = () => {
        if (!isLoading && hasMore && selectedGroup === "All") {
            const nextPage = pageNum + 1;
            setPageNum(nextPage);
            fetchDevices(selectedGroup, nextPage);
        }
    };

    const renderDeviceItem = useCallback(
        ({ item }: { item: Device }) => (
            <TouchableOpacity style={styles.deviceItem}>
                <Link href={`/devices/${item.id}`} style={styles.deviceName}>{item.name}</Link>
            </TouchableOpacity>
        ),
        [itemWidth]
    );  

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.header.color },
                    headerBackVisible: true,
                    headerLeft: () => (
                        <TouchableOpacity onPress={toggleGroupSelection} style={styles.headerLeft}>
                            <Text style={styles.headerText}>Accessories</Text>
                            <AntDesign name={isVisible ? "caretup" : "caretdown"} size={10} color={Colors.dark.icon} />
                        </TouchableOpacity>
                    ),
                }}
            />
            {isVisible && (
                <Animated.View style={styles.groupSelectionContainer}>
                    <Text style={styles.modalTitle}>Select Group</Text>
                    <View style={styles.roomSelection}>{groups.map(renderGroupButton)}</View>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.resetButton} onPress={() => handleGroupSelect(groups[0])}>
                            <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.okButton} onPress={toggleGroupSelection}>
                            <Text style={styles.okButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}

            {isLoading && devices.length === 0 ? (
                <ActivityIndicator size="large" color={Colors.dark.icon} />
            ) : (
                <FlatList
                    data={devices}
                    keyExtractor={(item) => item.id}
                    renderItem={renderDeviceItem}
                    onEndReached={loadMoreDevices}
                    onEndReachedThreshold={0.5}
                    numColumns={2}
                    ListFooterComponent={isLoading ? <ActivityIndicator size="large" color={Colors.dark.icon} /> : null}
                />
            )}

            {devices.length === 0 && !isLoading && (
                <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateText}>No devices found</Text>
                    <Link href={"/devices/addDevice"}> Add Device</Link>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 20,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerText: {
        color: Colors.dark.text,
        marginRight: 5,
        fontSize: 18,
        fontWeight: "bold",
    },
    groupSelectionContainer: {
        backgroundColor: "#FFFFFF",
        width: "90%",
        borderTopWidth: 1,
        borderRadius: 15,
        padding: 15,
        position: "absolute",
        top: 20,
        left: 5,
        zIndex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 16,
        color: Colors.light.text,
        marginBottom: 15,
        fontWeight: "bold",
        textAlign: "center",
    },
    roomSelection: {
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        marginBottom: 15,
    },
    roomButton: {
        margin: 5,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: Colors.dark.tint,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.light.background,
        alignSelf: "flex-start",
        maxWidth: "45%",
    },
    activeGroupButton: {
        backgroundColor: "#c2ecfc",
        borderColor: "#A8D8E3",
    },
    roomButtonText: {
        textAlign: "center",
        color: Colors.dark.text,
        fontSize: 14,
        lineHeight: 18,
    },
    activeGroupText: {
        color: "#FFFFFF",
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    resetButton: {
        flex: 1,
        marginRight: 5,
        backgroundColor: "#d6d6d6",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    okButton: {
        flex: 1,
        marginLeft: 5,
        backgroundColor: "#c2ecfc",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    resetButtonText: {
        textAlign: "center",
        color: Colors.light.text,
        fontSize: 14,
    },
    okButtonText: {
        textAlign: "center",
        color: Colors.light.text,
        fontSize: 14,
    },
    deviceItem: {
        margin: 5,
        padding: 15,
        borderBottomColor: Colors.light.tint,
        backgroundColor: Colors.light.background, 
        borderRadius: 10,
        shadowColor: "#000", 
        shadowOffset: {
            width: 0, 
            height: 2, 
        },
        shadowOpacity: 0.25, 
        shadowRadius: 3.84, 
        elevation: 5, 
    },
    deviceName: {
        fontSize: 16,
        color: Colors.light.text,
        textAlign: 'center', 
    },
    emptyStateContainer: {
        marginTop: 50,
        alignItems: "center",
    },
    emptyStateText: {
        fontSize: 18,
        color: Colors.dark.text,
    },
});
