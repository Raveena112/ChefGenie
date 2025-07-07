import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Search, BarChart3, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserFromLocalStorage, clearUserFromLocalStorage } from '@/lib/storage';

const ProfileSidebar = () => {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [lastSearch, setLastSearch] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    const lastQuery = localStorage.getItem('lastSearchQuery') || '';
    setFavoriteCount(favorites.length);
    setLastSearch(lastQuery);

    const { name, email } = getUserFromLocalStorage();
    setUserName(name);
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    clearUserFromLocalStorage();
    navigate('/login');
  };

  const favoriteRecipes = [
    { name: 'Spicy Chicken Curry', searchCount: 15 },
    { name: 'Vegetable Biryani', searchCount: 12 },
    { name: 'Paneer Butter Masala', searchCount: 8 },
    { name: 'Fish Curry', searchCount: 6 },
    { name: 'Dal Tadka', searchCount: 10 }
  ];

  const recentSearches = [
    'Chicken tikka masala',
    'Vegetable pulao',
    'Samosa recipe',
    'Gulab jamun'
  ];

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-lg p-6 overflow-y-auto z-40">
      {/* User Profile */}
      <Card className="mb-6">
        <CardHeader className="text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarFallback className="bg-orange-500 text-white text-xl">
              {userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <CardTitle>{userName}</CardTitle>
          <p className="text-gray-600">{userEmail}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Edit Profile</span>
          </Button>
          <Button variant="secondary" className="w-full" onClick={handleLogout}>
            Go to Login Page
          </Button>
        </CardContent>
      </Card>

      {/* Favorites */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Favorite Recipes</span>
            </div>
            <Link to="/favorites">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {favoriteCount > 0 ? (
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-orange-600 mb-2">{favoriteCount}</div>
              <p className="text-gray-600">Saved Recipes</p>
              <Link to="/favorites">
                <Button className="mt-2 bg-orange-500 hover:bg-orange-600">
                  View Favorites
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteRecipes.slice(0, 3).map((recipe, index) => (
                <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <h4 className="font-medium text-sm">{recipe.name}</h4>
                    <p className="text-xs text-gray-500">Popular recipe</p>
                  </div>
                  <Heart className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Searches */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-blue-500" />
            <span>Recent Searches</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {lastSearch && (
              <div className="p-2 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm font-medium text-blue-800">Latest: {lastSearch}</p>
              </div>
            )}
            {recentSearches.slice(0, 3).map((search, index) => (
              <div key={index} className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <p className="text-sm text-gray-700">{search}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <span>Your Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Recipes</span>
              <span className="font-semibold">{favoriteCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Favorites</span>
              <span className="font-semibold">{favoriteCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Language</span>
              <span className="font-semibold">{localStorage.getItem('lastLanguage') || 'English'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Search</span>
              <span className="font-semibold text-xs">{lastSearch || 'None'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSidebar;
