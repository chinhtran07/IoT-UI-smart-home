import Header from '@/src/components/home/header';
import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const DashboardScreen = () => {
  return (
    <SafeAreaView>
      <Header />
      <ScrollView>
        <View>
          <Card>
            <Card.Content>
              <Title>Temperature</Title>
              <Paragraph>24°C</Paragraph>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <Title>Lights</Title>
              <Paragraph>All lights are off</Paragraph>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <Title>Camera</Title>
              <Paragraph>Front door camera active</Paragraph>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default DashboardScreen;
