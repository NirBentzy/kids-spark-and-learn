
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faAppleAlt, faCarrot, faCat, faDog, faOtter, faFish,
  faPaw, faHouse, faIceCream, faGlassWater, faChessKing,
  faFeather, faLemon, faPencil, faChessQueen, faWorm
} from '@fortawesome/free-solid-svg-icons';
import { Question } from "@/types";

export const vocabularyItems = [
  { word: "apple", icon: faAppleAlt },
  { word: "banana", icon: faCarrot }, // Using carrot as a replacement
  { word: "cat", icon: faCat },
  { word: "dog", icon: faDog },
  { word: "elephant", icon: faOtter }, // Using otter as placeholder
  { word: "fish", icon: faFish },
  { word: "giraffe", icon: faPaw }, // Using paw as placeholder
  { word: "house", icon: faHouse },
  { word: "ice cream", icon: faIceCream },
  { word: "juice", icon: faGlassWater },
  { word: "king", icon: faChessKing },
  { word: "lion", icon: faCat },
  { word: "monkey", icon: faPaw },
  { word: "nest", icon: faFeather },
  { word: "orange", icon: faLemon }, // Using lemon as a replacement
  { word: "pencil", icon: faPencil },
  { word: "queen", icon: faChessQueen },
  { word: "rabbit", icon: faPaw },
  { word: "snake", icon: faWorm },
  { word: "tiger", icon: faCat }
];

export const generateVocabularyQuestion = (): Question => {
  const randomIndex = Math.floor(Math.random() * vocabularyItems.length);
  const item = vocabularyItems[randomIndex];
  
  return {
    id: Date.now(),
    type: 'english-word',
    content: item.word,
    correctAnswer: item.word,
  };
};

export const getCurrentIcon = (content: string | undefined) => {
  if (!content) return null;
  
  const item = vocabularyItems.find(item => item.word === content);
  
  if (!item) return null;
  
  return <FontAwesomeIcon icon={item.icon} size="6x" className="text-purple-600" />;
};
