import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddDeck = ({ navigation }) => {
  const [deckTitle, setDeckTitle] = useState('');

  const handleAddDeck = async () => {
    if (!deckTitle) {
      return;
    }

    try {
      const newDeckId = Date.now().toString();
      const newDeck = { id: newDeckId, title: deckTitle, flashcards: [] };
      const decksJSON = await AsyncStorage.getItem('decks');
      let decksData = JSON.parse(decksJSON) || {};
      decksData[newDeckId] = newDeck;
      await AsyncStorage.setItem('decks', JSON.stringify(decksData));
      setDeckTitle('');
      navigation.navigate('Deck List');
    } catch (error) {
      console.error('Failed to add deck: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is the title of your new deck?</Text>
      <TextInput
        style={styles.input}
        value={deckTitle}
        onChangeText={setDeckTitle}
        placeholder="Enter deck title"
        autoFocus={true}
      />
      <Button title="Add Deck" onPress={handleAddDeck} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    fontSize: 20,
  },
});

export default AddDeck;
