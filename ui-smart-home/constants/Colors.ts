// Define the primary color for light mode
const tintColorLight = '#007BFF'; // Bright Blue
const tintColorDark = '#1F1F1F'; // Dark Gray

export const Colors = {
  light: {
    text: '#212529', // Dark text for better readability
    background: '#F8F9FA', // Light gray background
    tint: tintColorLight, // Bright Blue
    icon: '#343A40', // Dark gray for icons
    tabIconDefault: '#6C757D', // Gray for default tab icons
    tabIconSelected: tintColorLight, // Bright Blue for selected tab icons
  },
  dark: {
    text: '#EAEAEA', // Light text for dark mode
    background: '#1B1B1B', // Very dark gray background
    tint: tintColorDark, // Dark Gray
    icon: '#B0B3B8', // Light gray for icons
    tabIconDefault: '#6C757D', // Gray for default tab icons
    tabIconSelected: tintColorDark, // Dark Gray for selected tab icons
  },
  header: {
    color: "#001F3F"
  }
};
