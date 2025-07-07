
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, ArrowLeft, Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import RecipeCard from '@/components/RecipeCard';

const Favorites = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    setFavoriteRecipes(savedFavorites);
  }, []);

  const handleDeleteFavorite = (recipeId: number) => {
    const updatedFavorites = favoriteRecipes.filter(recipe => recipe.id !== recipeId);
    setFavoriteRecipes(updatedFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
    toast.success('Recipe removed from favorites');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <ChefHat className="w-8 h-8 text-orange-500" />
                <span className="text-2xl font-bold text-gray-800">Favorite Recipes</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Favorite Recipes</h1>
            <p className="text-gray-600">
              {favoriteRecipes.length > 0 
                ? `You have ${favoriteRecipes.length} saved recipe${favoriteRecipes.length !== 1 ? 's' : ''}`
                : 'No favorite recipes yet. Generate and save some recipes from the dashboard!'
              }
            </p>
          </div>

          {favoriteRecipes.length === 0 ? (
            <Card className="p-8 text-center">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h3>
              <p className="text-gray-500 mb-4">Start by generating recipes on the dashboard and save the ones you love!</p>
              <Link to="/dashboard">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Generate Recipes
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-8">
              {favoriteRecipes.map((recipe) => (
                <Card key={recipe.id} className="shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl text-orange-600">{recipe.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        Saved on {new Date(recipe.savedAt).toLocaleDateString()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFavorite(recipe.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RecipeCard recipe={recipe} language={recipe.language || 'english'} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
