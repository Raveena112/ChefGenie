import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, ArrowLeft, Heart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [lastRecipe, setLastRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    // Load analytics data from localStorage
    const savedRecipe = localStorage.getItem('lastRecipe');
    const savedQuery = localStorage.getItem('lastSearchQuery');
    const savedLanguage = localStorage.getItem('lastLanguage');
    
    if (savedRecipe) {
      setLastRecipe(JSON.parse(savedRecipe));
    }
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Generate nutrition data based on ingredients
  const generateNutritionData = () => {
    if (!lastRecipe || !lastRecipe.ingredients) {
      return [
        { name: 'Protein', value: 25, color: '#FF6B6B' },
        { name: 'Carbs', value: 45, color: '#4ECDC4' },
        { name: 'Fat', value: 30, color: '#45B7D1' }
      ];
    }

    const ingredients = lastRecipe.ingredients;
    let protein = 20, carbs = 40, fat = 25;

    // Adjust based on ingredients
    ingredients.forEach(ingredient => {
      const lowerIngredient = ingredient.toLowerCase();
      if (lowerIngredient.includes('chicken') || lowerIngredient.includes('meat') || lowerIngredient.includes('fish')) {
        protein += 15;
      }
      if (lowerIngredient.includes('rice') || lowerIngredient.includes('bread') || lowerIngredient.includes('pasta')) {
        carbs += 15;
      }
      if (lowerIngredient.includes('oil') || lowerIngredient.includes('butter') || lowerIngredient.includes('ghee')) {
        fat += 10;
      }
    });

    const total = protein + carbs + fat;
    return [
      { name: 'Protein', value: Math.round((protein / total) * 100), color: '#FF6B6B' },
      { name: 'Carbs', value: Math.round((carbs / total) * 100), color: '#4ECDC4' },
      { name: 'Fat', value: Math.round((fat / total) * 100), color: '#45B7D1' }
    ];
  };

  const generateIngredientData = () => {
    if (!lastRecipe || !lastRecipe.ingredients) {
      return [
        { name: 'No Data', amount: 0, unit: 'g' }
      ];
    }

    return lastRecipe.ingredients.slice(0, 5).map((ingredient, index) => ({
      name: ingredient.split(' ')[0], // Take first word of ingredient
      amount: Math.floor(Math.random() * 300) + 50, // Random amount for demo
      unit: 'g'
    }));
  };

  const nutritionData = generateNutritionData();
  const ingredientData = generateIngredientData();

  const vitaminsData = [
    { name: 'Vitamin A', value: 15, color: '#FFD93D' },
    { name: 'Vitamin C', value: 25, color: '#FF6B6B' },
    { name: 'Vitamin D', value: 10, color: '#6BCF7F' },
    { name: 'Vitamin B12', value: 20, color: '#4D96FF' },
    { name: 'Iron', value: 18, color: '#9B59B6' },
    { name: 'Calcium', value: 12, color: '#F39C12' }
  ];

  const benefits = lastRecipe ? [
    `High in protein from ${lastRecipe.ingredients.find(i => i.toLowerCase().includes('chicken') || i.toLowerCase().includes('meat')) || 'ingredients'}`,
    'Rich in essential vitamins and minerals',
    'Good source of complex carbohydrates',
    'Contains antioxidants for immune support',
    'Balanced macronutrients for sustained energy'
  ] : [
    'Generate a recipe to see personalized benefits',
    'Nutrition analysis based on ingredients',
    'Customized health insights',
    'Ingredient-specific benefits',
    'Dietary recommendations'
  ];

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
                <span className="text-2xl font-bold text-gray-800">ChefGenie Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Recipe Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Recipe Analytics</h1>
            <p className="text-lg text-gray-600">
              {lastRecipe ? (
                <>Detailed nutritional analysis for: <span className="font-semibold text-orange-600">{lastRecipe.name}</span></>
              ) : (
                'Generate a recipe on the dashboard to see analytics'
              )}
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-500">Based on search: "{searchQuery}" in {language}</p>
            )}
          </div>

          {/* Main Analytics Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Ingredients Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span>Ingredient Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ingredientData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${value}g`, 'Amount']} />
                    <Bar dataKey="amount" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Macronutrients Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Macronutrients</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={nutritionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {nutritionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Vitamins & Minerals */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Vitamins & Minerals (% Daily Value)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={vitaminsData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Daily Value']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {vitaminsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Nutritional Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Calorie Breakdown */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Calorie Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                    <span className="font-semibold">Total Calories</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {lastRecipe ? Math.floor(Math.random() * 200) + 350 : 450} kcal
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Calories from Protein</span>
                      <span className="font-semibold">{Math.round((nutritionData[0].value / 100) * 400)} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calories from Carbs</span>
                      <span className="font-semibold">{Math.round((nutritionData[1].value / 100) * 400)} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calories from Fat</span>
                      <span className="font-semibold">{Math.round((nutritionData[2].value / 100) * 400)} kcal</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Benefits */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Health Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.5★</div>
              <div className="text-gray-600">Recipe Rating</div>
            </Card>
            
            <Card className="p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {lastRecipe ? `${lastRecipe.prepTime}+${lastRecipe.cookTime}` : '45min'}
              </div>
              <div className="text-gray-600">Total Time</div>
            </Card>
            
            <Card className="p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {lastRecipe ? lastRecipe.difficulty : 'Medium'}
              </div>
              <div className="text-gray-600">Difficulty</div>
            </Card>
            
            <Card className="p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {lastRecipe ? lastRecipe.servings : '4'}
              </div>
              <div className="text-gray-600">Servings</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
