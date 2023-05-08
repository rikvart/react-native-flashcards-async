import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddFlashcard = ({ navigation, route }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSave = async () => {
    const { deckId } = route.params;
    const decks = await AsyncStorage.getItem('decks');
    const parsedDecks = JSON.parse(decks) || {};
    const deck = parsedDecks[deckId];
    const newFlashcard = { id: Date.now().toString(), question, answer };
    const updatedDeck = { ...deck, flashcards: [...deck.flashcards, newFlashcard] };
    const updatedDecks = { ...parsedDecks, [deckId]: updatedDeck };
    await AsyncStorage.setItem('decks', JSON.stringify(updatedDecks));
    navigation.goBack();
  };

  return (
    <>
      <TextInput
        label="Question"
        value={question}
        onChangeText={setQuestion}
        style={{ marginBottom: 16 }}
      />
      <TextInput
        label="Answer"
        value={answer}
        onChangeText={setAnswer}
        style={{ marginBottom: 16 }}
      />
      <Button mode="contained" onPress={handleSave} disabled={!question || !answer}>
        Save
      </Button>
    </>
  );
};

export default AddFlashcard;