import React from "react";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image, StyleProp, ViewStyle } from "react-native";
import { Card, Paragraph, Title } from 'react-native-paper';

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
            <Card style={[styles.card, { backgroundColor: isActive ? 'white' : 'rgba(0, 0, 0, 0.6)' }]}>
                {image && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.image} />
                    </View>
                )}
                <Card.Content style={styles.cardContent}>
                    <Title style={[styles.title, { color: isActive ? 'black' : 'white' }]}>{title}</Title>
                    <Paragraph style={[styles.paragraph, { color: isActive ? 'black' : 'white' }]}>
                        {paragraph}
                    </Paragraph>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '50%', // Chiều rộng tương tự AddDeviceCard
        padding: 10,
    },
    card: {
        borderRadius: 10, // Bo góc
        aspectRatio: 1, // Giữ card hình vuông
        justifyContent: 'flex-end', // Căn nội dung xuống dưới
        position: 'relative', // Để hình ảnh nằm ở vị trí chính xác
    },
    imageContainer: {
        position: 'absolute',
        top: -70,
        left: 10,
        borderRadius: 20, // Bo tròn
        padding: 8,
    },
    image: {
        width: 40, // Chiều rộng của hình ảnh
        height: 40, // Chiều cao của hình ảnh
        borderRadius: 12, // Bo tròn hình ảnh (trong trường hợp là hình tròn)
    },
    cardContent: {
        justifyContent: 'flex-end', // Căn nội dung xuống cuối thẻ
        paddingBottom: 20, // Khoảng cách với nút bên dưới
    },
    title: {
        color: 'white', // Màu chữ trắng khi nền đen
    },
    paragraph: {
        color: 'white', // Màu chữ trắng khi nền đen
    },
});

export default CustomCard;