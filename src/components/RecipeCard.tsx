import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat, Mic, Square } from 'lucide-react';
import { useState } from 'react';

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  language: string;
}

const RecipeCard = ({ recipe, language }: RecipeCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const getTranslatedText = (text: string) => {
    const uiTranslations = {
      telugu: {
        'Ingredients': 'పదార్థాలు',
        'Instructions': 'సూచనలు',
        'Prep': 'తయారీ',
        'Cook': 'వంట',
        'minutes': 'నిమిషాలు',
        'people': 'వ్యక్తులు',
        'Easy': 'సులభం',
        'Medium': 'మధ్యమం',
        'Hard': 'కష్టం',
        'Listen': 'వినండి',
        'Playing...': 'ప్లే అవుతోంది...',
        'Stop': 'ఆపండి'
      },
      hindi: {
        'Ingredients': 'सामग्री',
        'Instructions': 'निर्देश',
        'Prep': 'तैयारी',
        'Cook': 'खाना बनाना',
        'minutes': 'मिनट',
        'people': 'लोग',
        'Easy': 'आसान',
        'Medium': 'मध्यम',
        'Hard': 'कठिन',
        'Listen': 'सुनें',
        'Playing...': 'चल रहा है...',
        'Stop': 'रोकें'
      }
    };

    if (language === 'english') return text;
    
    const translationMap = uiTranslations[language as keyof typeof uiTranslations];
    if (translationMap && translationMap[text as keyof typeof translationMap]) {
      return translationMap[text as keyof typeof translationMap];
    }
    
    return text;
  };

  const getRecipeContent = () => {
    const content = `
      ${recipe.name}
      
      ${getTranslatedText('Ingredients')}:
      ${recipe.ingredients.map(ingredient => `${ingredient}`).join('. ')}
      
      ${getTranslatedText('Instructions')}:
      ${recipe.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('. ')}
    `;
    return content;
  };
  const handleVoicePlayback = () => {
  if (!('speechSynthesis' in window)) {
    alert('Speech synthesis not supported in this browser');
    return;
  }

  if (isPlaying && currentUtterance) {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentUtterance(null);
    return;
  }

  const content = getRecipeContent();
  const utterance = new SpeechSynthesisUtterance(content);

  // Set correct language code
  const langCode = language === 'telugu' ? 'te-IN' :
                   language === 'hindi' ? 'hi-IN' :
                   'en-US';

  utterance.lang = langCode;

  // Try to find a matching voice for Telugu or Hindi
  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find((voice) =>
    voice.lang.toLowerCase().includes(langCode.toLowerCase())
  );

  if (matchingVoice) {
    utterance.voice = matchingVoice;
  } else {
    alert(`No voice found for ${langCode}. Please install voice support for your system.`);
    console.warn(`No matching voice found for ${langCode}`);
  }

  utterance.rate = 0.8;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onstart = () => setIsPlaying(true);
  utterance.onend = () => {
    setIsPlaying(false);
    setCurrentUtterance(null);
  };
  utterance.onerror = () => {
    setIsPlaying(false);
    setCurrentUtterance(null);
    alert('Speech synthesis error');
  };

  setCurrentUtterance(utterance);
  window.speechSynthesis.speak(utterance);
};


  // const handleVoicePlayback = () => {
  //   if (!('speechSynthesis' in window)) {
  //     alert('Speech synthesis not supported in this browser');
  //     return;
  //   }

  //   if (isPlaying && currentUtterance) {
  //     window.speechSynthesis.cancel();
  //     setIsPlaying(false);
  //     setCurrentUtterance(null);
  //     return;
  //   }

  //   const content = getRecipeContent();
  //   const utterance = new SpeechSynthesisUtterance(content);
    
  //   // Set proper language codes for speech synthesis
  //   if (language === 'hindi') {
  //     utterance.lang = 'hi-IN';
  //   } else if (language === 'telugu') {
  //     utterance.lang = 'te-IN';
  //   } else {
  //     utterance.lang = 'en-US';
  //   }
    
  //   utterance.rate = 0.7;
  //   utterance.pitch = 1;
  //   utterance.volume = 0.9;

  //   utterance.onstart = () => {
  //     setIsPlaying(true);
  //   };

  //   utterance.onend = () => {
  //     setIsPlaying(false);
  //     setCurrentUtterance(null);
  //   };

  //   utterance.onerror = () => {
  //     setIsPlaying(false);
  //     setCurrentUtterance(null);
  //     alert('Error occurred during speech synthesis');
  //   };

  //   setCurrentUtterance(utterance);
  //   window.speechSynthesis.speak(utterance);
  // };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{recipe.name}</h2>
          <div className="flex space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{getTranslatedText('Prep')}: {recipe.prepTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{getTranslatedText('Cook')}: {recipe.cookTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ChefHat className="w-4 h-4" />
              <Badge variant="outline">{recipe.difficulty}</Badge>
            </div>
          </div>
        </div>
        <Button
          onClick={handleVoicePlayback}
          variant="outline"
          className={`flex items-center space-x-2 ${isPlaying ? 'bg-green-50 border-green-500' : ''}`}
        >
          {isPlaying ? (
            <Square className="w-4 h-4 text-green-500" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
          <span>
            {isPlaying ? getTranslatedText('Stop') : getTranslatedText('Listen')}
          </span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{getTranslatedText('Ingredients')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{getTranslatedText('Instructions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed">{instruction}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Badge className="bg-blue-100 text-blue-800">
          Recipe in {language === 'english' ? 'English' : language === 'telugu' ? 'Telugu (తెలుగు)' : 'Hindi (हिंदी)'}
        </Badge>
      </div>
    </div>
  );
};

export default RecipeCard;

