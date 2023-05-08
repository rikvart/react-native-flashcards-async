import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DeckList from './views/DeckList';
import DeckDetails from './views/DeckDetails';
import AddFlashcard from './views/AddFlashcard';
import AddDeck from './views/AddDeck';
import Quiz from './views/Quiz';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DeckList">
        <Stack.Screen name="DeckList" component={DeckList} options={{ title: 'My Decks' }} />
        <Stack.Screen name="Deck Details" component={DeckDetails} options={{ title: 'Deck Details' }}/>
        <Stack.Screen name="AddDeck" component={AddDeck} options={{ title: 'Add Deck' }} />
        <Stack.Screen name="Add Flashcard" component={AddFlashcard} options={{ title: 'Add Flashcard' }} />
        <Stack.Screen name="Quiz" component={Quiz} options={{ title: 'Quiz' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
