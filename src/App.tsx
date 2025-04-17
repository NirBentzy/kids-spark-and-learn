import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import SubjectSelection from "./pages/SubjectSelection";
import EnglishSelection from "./pages/EnglishSelection";
import MathGame from "./pages/MathGame";
import EnglishLetterGame from "./pages/EnglishLetterGame";
import EnglishVocabularyGame from "./pages/EnglishVocabularyGame";
import EnglishTranslationGame from "./pages/EnglishTranslationGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/subjects" element={<SubjectSelection />} />
          <Route path="/english" element={<EnglishSelection />} />
          <Route path="/math" element={<MathGame />} />
          <Route path="/english/letters" element={<EnglishLetterGame />} />
          <Route path="/english/vocabulary" element={<EnglishVocabularyGame />} />
          <Route path="/english/translation" element={<EnglishTranslationGame />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
