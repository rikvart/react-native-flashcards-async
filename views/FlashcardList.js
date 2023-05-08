import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Flashcard from './Flashcard';

const FlashcardList = ({ navigation }) => {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const getDecks = async () => {
      const decks = await AsyncStorage.getItem('decks');
      const parsedDecks = JSON.parse(decks) || {};
      const deckList = Object.values(parsedDecks);
      setDecks(deckList);
    };
    getDecks();
  }, []);

  const handleDeckPress = (deckId) => {
    navigation.navigate('Add Flashcard', { deckId });
  };

  const handleAddDeck = async () => {
    const newDeck = { id: Date.now().toString(), name: 'New Deck', flashcards: [] };
    const updatedDecks = [...decks, newDeck];
    await AsyncStorage.setItem('decks', JSON.stringify(updatedDecks));
    setDecks(updatedDecks);
    navigation.navigate('Flashcard List');
  };

  return (
    <View>
      <Button title="Add Deck" onPress={handleAddDeck} />
      {decks.length ? (
        <FlatList
          data={decks}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleDeckPress(item.id)}>
              <Text>{item.name}</Text>
              <Text>{item.flashcards.length} flashcards</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>No decks yet!</Text>
      )}
    </View>
  );
};

export default FlashcardList;
