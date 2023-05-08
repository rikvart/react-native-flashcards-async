import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, List, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeckList = ({ navigation }) => {
  const [decks, setDecks] = useState([]);
  const [deckName, setDeckName] = useState('');

  useEffect(() => {
    const loadDecks = async () => {
      const decksJSON = await AsyncStorage.getItem('decks');
      const decksData = JSON.parse(decksJSON);
      if (decksData) {
        setDecks(Object.values(decksData));
      }
    };
    loadDecks();
  }, []);

  const handleAddDeck = async () => {
    const newDeck = {
      id: Date.now().toString(),
      title: deckName,
      flashcards: [],
    };
    await AsyncStorage.mergeItem('decks', JSON.stringify({ [newDeck.id]: newDeck }));
    setDecks([...decks, newDeck]);
    setDeckName('');
    navigation.navigate('DeckList');
  };

  const handlePressDeck = (deckId) => {
    navigation.navigate('Deck Details', { deckId });
  };

  const handleDeleteDeck = async (deckId) => {
    const newDecks = decks.filter((deck) => deck.id !== deckId);
    await AsyncStorage.setItem('decks', JSON.stringify(newDecks.reduce((acc, deck) => ({ ...acc, [deck.id]: deck }), {})));
    setDecks(newDecks);
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.title}
      description={`${item.flashcards.length} cards`}
      onPress={() => handlePressDeck(item.id)}
      right={() => (
        <Button mode="contained" onPress={() => handleDeleteDeck(item.id)}>
          Delete
        </Button>
      )}
      style={styles.deckCard}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.addDeckContainer}>
        <TextInput style={styles.addDeckInput} value={deckName} onChangeText={setDeckName} placeholder="Enter deck name" />
        <Button mode="contained" onPress={handleAddDeck} disabled={!deckName}>
          Add Deck
        </Button>
      </View>
      <FlatList data={decks} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  addDeckContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  addDeckInput: {
    flex: 1,
    marginRight: 16,
  },
  deckCard: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
});

export default DeckList;