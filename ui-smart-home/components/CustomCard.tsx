import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image, StyleProp, ViewStyle } from "react-native";
import { Card, Paragraph, Title } from 'react-native-paper';
import  Colors  from '@/constants/Colors'; // Adjust the import path as needed

type CustomCardProps = {
    image?: string;
    title?: string;
    paragraph?: string;
    style: StyleProp<ViewStyle>;
};

const CustomCard: React.FC<CustomCardProps> = ({
    image,
    title = "Card Title",
    paragraph = "This is a description of the card.",
    style
}) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <TouchableOpacity style={[styles.container, style]} onPress={() => setIsActive(!isActive)}>
            <Card style={[styles.card, { backgroundColor: isActive ? Colors.light.background : 'rgba(0, 0, 0, 0.6)' }]}>
                {image && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.image} />
                    </View>
                )}
                <Card.Content style={styles.cardContent}>
                    <Title style={[styles.title, { color: isActive ? Colors.light.text : 'white' }]}>{title}</Title>
                    <Paragraph style={[styles.paragraph, { color: isActive ? Colors.light.text : 'white' }]}>
                        {paragraph}
                    </Paragraph>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '50%',
        padding: 10,
    },
    card: {
        borderRadius: 10,
        aspectRatio: 1, 
        justifyContent: 'flex-end',
        position: 'relative',
    },
    imageContainer: {
        position: 'absolute',
        top: -70,
        left: 10,
        borderRadius: 20,
        padding: 8,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 12,
    },
    cardContent: {
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    title: {
        color: 'white', // Default to white for dark background
    },
    paragraph: {
        color: 'white', // Default to white for dark background
    },
});

export default CustomCard;
