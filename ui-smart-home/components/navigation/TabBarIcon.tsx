
import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';
import { ColorValue } from 'react-native';

interface TabBarIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: ColorValue;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color, size }) => {
  return <Ionicons name={name} size={size} color={color} />
}

export default TabBarIcon;
