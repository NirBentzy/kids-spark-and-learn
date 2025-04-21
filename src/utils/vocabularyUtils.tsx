
import React from 'react';
import { Question } from "@/types";

// List of words to use for image generation
export const vocabularyWords = [
  "dog", "cat", "face", "car", "book", "pen", "cup", "sun", 
  "moon", "star", "tree", "house", "bird", "fish", "duck", 
  "bear", "lion", "apple", "banana", "orange", "grape", "cherry",
  "flower", "plant", "bus", "train", "plane", "ship", "key"
];

export const generateVocabularyQuestion = (): Question => {
  // Get a random word from our vocabulary list
  const randomIndex = Math.floor(Math.random() * vocabularyWords.length);
  const word = vocabularyWords[randomIndex];
  
  // Create the image URL based on the selected word
  const imageUrl = `https://img.icons8.com/ios-filled/100/${word}.png`;
  
  return {
    id: Date.now(),
    type: 'english-word',
    content: word,
    correctAnswer: word,
    imageUrl: imageUrl, // Add the image URL to the question
  };
};

export const getCurrentIcon = (content: string | undefined) => {
  if (!content) return null;
  
  // We're no longer using FontAwesome icons, instead we're using the imageUrl
  return null;
};
