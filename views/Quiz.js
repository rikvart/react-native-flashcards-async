import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TouchableRipple } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gyroscope } from 'expo-sensors';

const Quiz = ({ route, navigation }) => {
  const [deck, setDeck] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCards, setCorrectCards] = useState([]);
  const [incorrectCards, setIncorrectCards] = useState([]);
  const [gyroData, setGyroData] = useState({});

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleCorrect = () => {
    setCorrectCards([...correctCards, currentCard]);
    setShowAnswer(false);
    setCurrentCard(currentCard + 1);
  };

  const handleIncorrect = () => {
    setIncorrectCards([...incorrectCards, currentCard]);
    setShowAnswer(false);
    setCurrentCard(currentCard + 1);
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


  useEffect(() => {
    const subscribe = Gyroscope.addListener(gyroData => {
      setGyroData(gyroData);
      if (gyroData.y > 1) {
        setShowAnswer(true);
      }
    });
    return () => subscribe && subscribe.remove();
  }, []);

  if (!deck) {
    return <Text>Loading...</Text>;
  }

  if (currentCard === deck.flashcards.length) {
    const score = (correctCards.length / deck.flashcards.length) * 100;
    const message = `You got ${score}% correct. (${correctCards.length} out of ${deck.flashcards.length} cards)`;
    return (
      <View style={styles.container}>
        <Text style={styles.deckTitle}>Quiz Complete</Text>
        <Text style={styles.deckSubtitle}>{message}</Text>
        <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('Deck Details', { deckId: deck.id })}>
          Back to Deck
        </Button>
      </View>
    );
  }

  const currentFlashcard = deck.flashcards[currentCard];

  return (
    <View style={styles.container}>
      <Text style={styles.cardNumber}>{`Card ${currentCard + 1} of ${deck.flashcards.length}`}</Text>
      <Text style={styles.question}>{showAnswer ? currentFlashcard.answer : currentFlashcard.question}</Text>
      {!showAnswer && (
        <Button mode="contained" onPress={handleShowAnswer}>
          Show Answer
        </Button>
      )}
      {showAnswer && (
        <View style={styles.answerButtonsContainer}>
          <Button mode="contained" style={styles.correctButton} onPress={handleCorrect}>
            Correct
          </Button>
          <Button mode="contained" style={styles.incorrectButton} onPress={handleIncorrect}>
            Incorrect
          </Button>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardNumber: {
      fontSize: 18,
      marginBottom: 16,
    },
    question: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 32,
    },
    showAnswerButton: {
      fontSize: 18,
      marginBottom: 32,
    },
    answerButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: 32,
      width: '80%',
    },
    deckTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,

    },
    deckSubtitle: {
      fontSize: 18,
      marginBottom: 32,
    },
    scoreMessage: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 32,
      
    },
  });

  export default Quiz;