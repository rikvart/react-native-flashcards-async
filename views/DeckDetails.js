import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeckDetails = ({ route, navigation }) => {
  const [deck, setDeck] = useState(null);

  const handleAddFlashcard = async () => {
    navigation.navigate('Add Flashcard', { deckId: deck.id });
  };

  const handleStartQuiz = () => {
    navigation.navigate('Quiz', { deckId: deck.id, flashcards: deck.flashcards });
  };

  useEffect(() => {
    const loadDeck = async () => {
      const decksJSON = await AsyncStorage.getItem('decks');
      const decksData = JSON.parse(decksJSON);
      const deckId = route.params.deckId;
      if (decksData && decksData[deckId]) {
        setDeck(decksData[deckId]);
      }
    };
    loadDeck();
  }, [route.params.deckId]);


  return (
    <View style={styles.container}>
      <Text style={styles.deckTitle}>{deck.title}</Text>
      <Text style={styles.deckSubtitle}>{`${deck.flashcards.length} cards`}</Text>
      
      <Button style={styles.deckTitle} mode="contained" onPress={handleAddFlashcard} >
          Add Flashcard
        </Button>
        <Button style={styles.deckTitle} mode="contained" onPress={handleStartQuiz} >
          Start Quiz
        </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  deckTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  deckSubtitle: {
    fontSize: 24,
    color: '#666',
    marginBottom: 32,
  },
});

export default DeckDetails;
