
interface TranslationWord {
  english: string;
  hebrew: string;
  level: number;
}

export const translationWords: TranslationWord[] = [
  // Level 1 - Basic words
  { english: "hello", hebrew: "שלום", level: 1 },
  { english: "bye", hebrew: "להתראות", level: 1 },
  { english: "yes", hebrew: "כן", level: 1 },
  { english: "no", hebrew: "לא", level: 1 },
  { english: "please", hebrew: "בבקשה", level: 1 },
  { english: "thank you", hebrew: "תודה", level: 1 },
  { english: "water", hebrew: "מים", level: 1 },
  { english: "bread", hebrew: "לחם", level: 1 },
  { english: "house", hebrew: "בית", level: 1 },
  { english: "good", hebrew: "טוב", level: 1 },
  
  // Level 2 - Common words
  { english: "book", hebrew: "ספר", level: 2 },
  { english: "table", hebrew: "שולחן", level: 2 },
  { english: "chair", hebrew: "כיסא", level: 2 },
  { english: "door", hebrew: "דלת", level: 2 },
  { english: "window", hebrew: "חלון", level: 2 },
  { english: "car", hebrew: "מכונית", level: 2 },
  { english: "food", hebrew: "אוכל", level: 2 },
  { english: "day", hebrew: "יום", level: 2 },
  { english: "night", hebrew: "לילה", level: 2 },
  { english: "friend", hebrew: "חבר", level: 2 },
  
  // Level 3 - More complex words
  { english: "computer", hebrew: "מחשב", level: 3 },
  { english: "telephone", hebrew: "טלפון", level: 3 },
  { english: "television", hebrew: "טלוויזיה", level: 3 },
  { english: "newspaper", hebrew: "עיתון", level: 3 },
  { english: "restaurant", hebrew: "מסעדה", level: 3 },
  { english: "hospital", hebrew: "בית חולים", level: 3 },
  { english: "university", hebrew: "אוניברסיטה", level: 3 },
  { english: "library", hebrew: "ספרייה", level: 3 },
  { english: "shopping", hebrew: "קניות", level: 3 },
  { english: "weather", hebrew: "מזג אוויר", level: 3 },
];
