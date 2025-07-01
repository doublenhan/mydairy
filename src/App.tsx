import React, { useState } from 'react';
import { Heart, BookOpen, Camera, Bell, Download as Download2, FileText, Menu, X, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import CreateMemory from './components/CreateMemory';
import ViewMemory from './components/ViewMemory';
import JourneyTracker from './components/JourneyTracker';
import AnniversaryReminders from './components/AnniversaryReminders';
import PDFExport from './components/PDFExport';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'create-memory' | 'view-memory' | 'journey-tracker' | 'anniversary-reminders' | 'pdf-export'>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Love Journaling",
      description: "Write and preserve your most precious romantic memories with our beautiful journaling interface."
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Photo Memories",
      description: "Upload and organize your favorite photos together, creating a visual timeline of your love story."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Anniversary Reminders",
      description: "Never miss important dates with smart reminders for anniversaries, birthdays, and special moments."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "PDF Export",
      description: "Transform your digital memories into beautiful PDF books that you can print and treasure forever."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Mood Tracking",
      description: "Track your relationship's journey with mood indicators and relationship milestone celebrations."
    },
    {
      icon: <Download2 className="w-8 h-8" />,
      title: "Cloud Sync",
      description: "Keep your memories safe with automatic cloud backup and sync across all your devices."
    }
  ];

  const galleryImages = [
    "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1024956/pexels-photo-1024956.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1024970/pexels-photo-1024970.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=400",
  ];

  if (currentPage === 'create-memory') {
    return <CreateMemory onBack={() => setCurrentPage('landing')} />;
  }

  if (currentPage === 'view-memory') {
    return <ViewMemory onBack={() => setCurrentPage('landing')} />;
  }

  if (currentPage === 'journey-tracker') {
    return <JourneyTracker onBack={() => setCurrentPage('landing')} />;
  }

  if (currentPage === 'anniversary-reminders') {
    return <AnniversaryReminders onBack={() => setCurrentPage('landing')} />;
  }

  if (currentPage === 'pdf-export') {
    return <PDFExport onBack={() => setCurrentPage('landing')} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Love Journal
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">Home</a>
              <a href="#features" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">Features</a>
              <button 
                onClick={() => setCurrentPage('view-memory')}
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                Gallery
              </button>
              <button 
                onClick={() => setCurrentPage('journey-tracker')}
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                Journey
              </button>
              <button 
                onClick={() => setCurrentPage('anniversary-reminders')}
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                Reminders
              </button>
              <button 
                onClick={() => setCurrentPage('pdf-export')}
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                Export PDF
              </button>
              <a href="#download" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">Download</a>
              <a href="#contact" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">Contact</a>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-pink-100 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-pink-600 font-medium">Home</a>
                <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-pink-600 font-medium">Features</a>
                <button 
                  onClick={() => {
                    setCurrentPage('view-memory');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-pink-600 font-medium"
                >
                  Gallery
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage('journey-tracker');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-pink-600 font-medium"
                >
                  Journey
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage('anniversary-reminders');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-pink-600 font-medium"
                >
                  Reminders
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage('pdf-export');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-pink-600 font-medium"
                >
                  Export PDF
                </button>
                <a href="#download" className="block px-3 py-2 text-gray-700 hover:text-pink-600 font-medium">Download</a>
                <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-pink-600 font-medium">Contact</a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-pink-50 via-white to-rose-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOWE4ZDQiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Capture your
                <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"> love moments</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Create a beautiful digital diary of your relationship. Store memories, photos, and milestones in one magical place that grows with your love story.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => setCurrentPage('create-memory')}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:from-pink-600 hover:to-rose-600 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Start Your Journey
                </button>
                <button 
                  onClick={() => setCurrentPage('journey-tracker')}
                  className="border-2 border-pink-200 text-pink-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:bg-pink-50"
                >
                  Journey Tracker
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Couple sharing moments" 
                  className="rounded-3xl shadow-2xl w-full h-auto"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full opacity-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for your
              <span className="text-pink-600"> love story</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover powerful features designed to help you capture, organize, and cherish every moment of your romantic journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-100 transition-all duration-300 hover:border-pink-200 hover:shadow-lg">
                <div className="text-pink-500 mb-4 transition-transform duration-300 hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              See Love Journal in
              <span className="text-pink-600"> action</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get inspired by how couples around the world are using Love Journal to document their beautiful relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl group">
                <img 
                  src={image} 
                  alt={`Love moment ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4">
                    <Heart className="w-6 h-6 text-white fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="py-20 bg-gradient-to-r from-pink-500 to-rose-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to start your love story?
          </h2>
          <p className="text-xl text-pink-100 mb-8 leading-relaxed">
            Join thousands of couples who trust Love Journal to preserve their most precious memories. Download now and get started for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:bg-pink-50 hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
              <Download2 className="w-5 h-5" />
              <span>Download for iOS</span>
            </button>
            <button className="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:bg-pink-50 hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
              <Download2 className="w-5 h-5" />
              <span>Download for Android</span>
            </button>
          </div>
          <p className="text-pink-100 mt-6 text-sm">
            Free to download • Premium features available • No ads, ever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Love Journal</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Helping couples around the world capture and preserve their most precious romantic memories. Because every love story deserves to be remembered.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-pink-400 transition-colors">Home</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-pink-400 transition-colors">Features</a></li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('view-memory')}
                    className="text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    Gallery
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('journey-tracker')}
                    className="text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    Journey
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('anniversary-reminders')}
                    className="text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    Reminders
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('pdf-export')}
                    className="text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    Export PDF
                  </button>
                </li>
                <li><a href="#download" className="text-gray-400 hover:text-pink-400 transition-colors">Download</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-pink-400" />
                  <span className="text-gray-400">hello@lovejournal.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-pink-400" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-pink-400" />
                  <span className="text-gray-400">San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Love Journal. Made with ❤️ for couples everywhere. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;