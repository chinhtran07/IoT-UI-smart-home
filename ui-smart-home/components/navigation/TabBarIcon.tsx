import { Ionicons } from "@expo/vector-icons"
import { FC } from "react";
import { ColorValue } from "react-native"

interface TabBarIconProps {
    name: keyof typeof Ionicons.glyphMap;
    color: ColorValue;
    size: number;
}

const TabBarIcon: FC<TabBarIconProps> = ({ name, color, size }) => {
    return <Ionicons name={name} size={size} color={color} />
}

export default TabBarIcon;