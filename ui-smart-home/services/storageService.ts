import AsyncStorage from "@react-native-async-storage/async-storage";

export const setData = async (key: string, data: string) => {
    try {
        await AsyncStorage.setItem(key, data);
    } catch (error) {
        console.error(`Failed to save ${key} to storage`, error)
    }
}

export const getData = async (key: string) => {
    try {
        const data = await AsyncStorage.getItem(key);
        return data;
    } catch (error) {
        console.error(`Failed to retrieve ${key} from storage`, error);
        return null;
    } 
}

export const removeData = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error(`Failed to remove ${key} from storage`, error);
    } 
}