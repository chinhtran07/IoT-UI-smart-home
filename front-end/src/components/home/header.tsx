// components/Header.tsx
import React from 'react';
import { StyleSheet} from 'react-native';
import { Appbar, Menu} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
  const router = useRouter();
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Appbar.Header style={styles.headerContainer}>
      <Appbar.Content title="Header"/>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
        <Appbar.Action 
        icon={() => <Ionicons name='add-circle-outline' size={24} color="dark" />} 
        onPress={openMenu} 
        /> 
        }
        style={styles.menu}
      >
        <Menu.Item title="Add Device" />
        <Menu.Item title="Add Room" />
        <Menu.Item title="Add Gateway" />
        </Menu>
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
  },
  headerTitle: {
    color: 'white',
    textAlignVertical: 'center',
  },
  menu: {
    marginTop: 40,
    marginRight: 10
  }
});
