import React from 'react';
import { Text, View } from 'react-native';

const Flashcard = ({ question, answer }) => {
  return (
    <View>
      <Text>{question}</Text>
      <Text>{answer}</Text>
    </View>
  );
};

export default Flashcard;