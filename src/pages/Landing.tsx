
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, Globe, BarChart3, Heart, Mic, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart Recipe Search",
      description: "Find recipes by ingredients or dish name with AI-powered suggestions"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Language Support",
      description: "Get recipes in English, Telugu, and Hindi with voice assistance"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Nutrition Analytics",
      description: "Detailed nutritional breakdown with visual charts and health benefits"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Personal Favorites",
      description: "Save and organize your favorite recipes for quick access"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "AI Voice Assistant",
      description: "Listen to recipes with natural voice narration in your preferred language"
    }
  ];

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
            <div className="flex space-x-4">
              <Link to="/signin">
                <Button variant="outline" className="hover:bg-orange-50">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-orange-500 hover:bg-orange-600">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-bounce mb-8">
            <ChefHat className="w-20 h-20 text-orange-500 mx-auto" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Your AI-Powered
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500"> Recipe Companion</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover, create, and enjoy delicious recipes with intelligent ingredient matching, 
            multilingual support, and detailed nutritional insights powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg">
                Start Cooking Now
              </Button>
            </Link>
            <Link to="/signin">
              <Button size="lg" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-4 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600">Everything you need for the perfect cooking experience</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-2 ${
                  activeFeature === index ? 'ring-2 ring-orange-500 bg-orange-50' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardContent className="p-0">
                  <div className="text-orange-500 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How ChefGenie Works</h2>
            <p className="text-lg text-gray-600">Simple steps to culinary excellence</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Enter Ingredients</h3>
              <p className="text-gray-600">Tell us what ingredients you have or the dish name you want to cook</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Choose Language</h3>
              <p className="text-gray-600">Select your preferred language: English, Telugu, or Hindi</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Get Recipe</h3>
              <p className="text-gray-600">Receive detailed recipe with nutrition analysis and voice guidance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChefHat className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold">ChefGenie</span>
          </div>
          <p className="text-gray-400 mb-8">Your AI-powered recipe companion for delicious cooking adventures</p>
          <div className="flex justify-center space-x-8">
            <Link to="/signup" className="hover:text-orange-500 transition-colors">Get Started</Link>
            <Link to="/signin" className="hover:text-orange-500 transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
