
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChefHat, Search, Heart, BarChart3, User, Mic, Save, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import RecipeCard from '@/components/RecipeCard';
import ProfileSidebar from '@/components/ProfileSidebar';
import { supabase } from '@/integrations/supabase/client';
import VoiceInput from '@/components/VoiceInput';


const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const handleGenerateRecipe = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter ingredients or recipe name');
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('Generating recipe with Gemini...');
      
      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: {
          query: searchQuery,
          language: selectedLanguage
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate recipe');
      }

      if (!data) {
        throw new Error('No recipe data received');
      }

      console.log('Generated recipe:', data);
      setGeneratedRecipe(data);
      toast.success('Recipe generated successfully with AI!');
      
      // Auto-save to analytics
      await saveToAnalytics(data, searchQuery);
      
    } catch (error) {
      console.error('Recipe generation error:', error);
      toast.error(`Failed to generate recipe: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleVoiceInput = (text: string) => {
  setSearchQuery((prev) => `${prev} ${text}`);
};

  const saveToAnalytics = async (recipe: any, searchQuery: string) => {
    try {
      // Store search analytics
      localStorage.setItem('lastSearchQuery', searchQuery);
      localStorage.setItem('lastRecipe', JSON.stringify(recipe));
      localStorage.setItem('lastLanguage', selectedLanguage);
      
      console.log('Analytics saved for:', searchQuery);
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  };

  const handleSaveRecipe = async () => {
    if (generatedRecipe) {
      try {
        // Save to localStorage as favorites
        const existingFavorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
        const newFavorite = {
          ...generatedRecipe,
          id: Date.now(),
          savedAt: new Date().toISOString(),
          language: selectedLanguage
        };
        
        const updatedFavorites = [...existingFavorites, newFavorite];
        localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
        
        toast.success('Recipe saved to favorites!');
      } catch (error) {
        console.error('Failed to save recipe:', error);
        toast.error('Failed to save recipe');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ChefHat className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-800">ChefGenie</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Button>
              <Link to="/analytics">
                <Button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Profile Sidebar */}
        {showProfile && <ProfileSidebar />}

        {/* Main Content */}
        <div className={`flex-1 p-6 transition-all duration-300 ${showProfile ? 'ml-80' : ''}`}>
          <div className="max-w-4xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Your Kitchen!</h1>
              <p className="text-gray-600">What would you like to cook today?</p>
            </div>

            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-orange-500" />
                  <span>Recipe Generator</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ingredients">Ingredients or Recipe Name</Label>
                    <Input
                      id="ingredients"
                      placeholder="e.g., chicken, pasta, biryani, vegetables"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="focus:ring-2 focus:ring-orange-500">
                        <SelectValue placeholder="Choose language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="telugu">Telugu (తెలుగు)</SelectItem>
                        <SelectItem value="hindi">Hindi (हिंदी)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    onClick={handleGenerateRecipe}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex-1"
                  >
                    {isGenerating ? 'Generating Recipe...' : 'Generate Recipe'}
                  </Button>
                  <div className="flex space-x-4">

                  <VoiceInput onResult={handleVoiceInput} />
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Generated Recipe */}
            {generatedRecipe && (
              <Card className="mb-8 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl text-orange-600">{generatedRecipe.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveRecipe} className="flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </Button>
                    <Link to="/analytics">
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>View Analytics</span>
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <RecipeCard recipe={generatedRecipe} language={selectedLanguage} />
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Favorites</h3>
                    <p className="text-gray-600">{JSON.parse(localStorage.getItem('favoriteRecipes') || '[]').length} saved recipes</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Search className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Searches</h3>
                    <p className="text-gray-600">Latest: {localStorage.getItem('lastSearchQuery') || 'None'}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Analytics</h3>
                    <p className="text-gray-600">View insights</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
