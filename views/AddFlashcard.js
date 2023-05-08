import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const he = require("he")

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

  const handleFetch = async () => {
    try {
      const response = await axios.get('https://opentdb.com/api.php?amount=1&type=boolean');
      const [result] = response.data.results;
      setQuestion(he.decode(result.question));
      setAnswer(he.decode(result.correct_answer));
    } catch (error) {
      console.log(error);
    }
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
      <Button style={styles.button} mode="contained" onPress={handleSave} disabled={!question || !answer}>
        Save
      </Button>
      <Button style={styles.button} mode="contained" onPress={handleFetch}>
        Random card
      </Button>

    </>
  );
};

const styles = {
    button: {
        width: 200,
        marginBottom: 20,

    }

}

export default AddFlashcard;