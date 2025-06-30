import React, { useState } from 'react';
import { Heart, BookOpen, Camera, Bell, Download as Download2, FileText, Menu, X, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import CreateMemory from './CreateMemory';
import ViewMemory from './ViewMemory';
import JourneyTracker from './JourneyTracker';
import AnniversaryReminders from './AnniversaryReminders';
import PDFExport from './PDFExport';
import './styles/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'create-memory' | 'view-memory' | 'journey-tracker' | 'anniversary-reminders' | 'pdf-export'>('view-memory');
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
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            {/* Logo */}
            <div className="logo">
              <div className="logo-icon">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="logo-text">
                Love Journal
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="nav-desktop">
              <a href="#home" className="nav-link">Home</a>
              <a href="#features" className="nav-link">Features</a>
              <button 
                onClick={() => setCurrentPage('view-memory')}
                className="nav-button"
              >
                Gallery
              </button>
              <button 
                onClick={() => setCurrentPage('journey-tracker')}
                className="nav-button"
              >
                Journey
              </button>
              <button 
                onClick={() => setCurrentPage('anniversary-reminders')}
                className="nav-button"
              >
                Reminders
              </button>
              <button 
                onClick={() => setCurrentPage('pdf-export')}
                className="nav-button"
              >
                Export PDF
              </button>
              <a href="#download" className="nav-link">Download</a>
              <a href="#contact" className="nav-link">Contact</a>
            </nav>

            {/* Mobile menu button */}
            <div className="mobile-menu-button">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-menu-button"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="mobile-menu">
              <div className="mobile-menu-content">
                <a href="#home" className="mobile-menu-link">Home</a>
                <a href="#features" className="mobile-menu-link">Features</a>
                <button 
                  onClick={() => {
                    setCurrentPage('view-memory');
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-menu-button"
                >
                  Gallery
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage('journey-tracker');
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-menu-button"
                >
                  Journey
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage('anniversary-reminders');
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-menu-button"
                >
                  Reminders
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage('pdf-export');
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-menu-button"
                >
                  Export PDF
                </button>
                <a href="#download" className="mobile-menu-link">Download</a>
                <a href="#contact" className="mobile-menu-link">Contact</a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-background"></div>
        
        <div className="hero-container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 className="hero-title">
                Capture your
                <span className="hero-title-highlight"> love moments</span>
              </h1>
              <p className="hero-description">
                Create a beautiful digital diary of your relationship. Store memories, photos, and milestones in one magical place that grows with your love story.
              </p>
              <div className="hero-buttons">
                <button 
                  onClick={() => setCurrentPage('create-memory')}
                  className="hero-button-primary"
                >
                  Start Your Journey
                </button>
                <button 
                  onClick={() => setCurrentPage('journey-tracker')}
                  className="hero-button-secondary"
                >
                  Journey Tracker
                </button>
              </div>
            </div>
            
            <div className="hero-image-container">
              <div className="hero-image-wrapper">
                <img 
                  src="https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Couple sharing moments" 
                  className="hero-image"
                />
              </div>
              <div className="hero-decoration-1"></div>
              <div className="hero-decoration-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              Everything you need for your
              <span className="features-title-highlight"> love story</span>
            </h2>
            <p className="features-description">
              Discover powerful features designed to help you capture, organize, and cherish every moment of your romantic journey.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery-section">
        <div className="gallery-container">
          <div className="gallery-header">
            <h2 className="gallery-title">
              See Love Journal in
              <span className="gallery-title-highlight"> action</span>
            </h2>
            <p className="gallery-description">
              Get inspired by how couples around the world are using Love Journal to document their beautiful relationships.
            </p>
          </div>

          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <div key={index} className="gallery-item">
                <img 
                  src={image} 
                  alt={`Love moment ${index + 1}`}
                  className="gallery-image"
                />
                <div className="gallery-overlay">
                  <div className="gallery-heart">
                    <Heart className="w-6 h-6 fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">
            Ready to start your love story?
          </h2>
          <p className="cta-description">
            Join thousands of couples who trust Love Journal to preserve their most precious memories. Download now and get started for free.
          </p>
          <div className="cta-buttons">
            <button className="cta-button">
              <Download2 className="w-5 h-5" />
              Download for iOS
            </button>
            <button className="cta-button">
              <Download2 className="w-5 h-5" />
              Download for Android
            </button>
          </div>
          <p className="cta-note">
            Free to download • Premium features available • No ads, ever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-company">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="footer-logo-text">Love Journal</span>
              </div>
              <p className="footer-description">
                Helping couples around the world capture and preserve their most precious romantic memories. Because every love story deserves to be remembered.
              </p>
              <div className="footer-social">
                <a href="#" className="footer-social-link">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="footer-social-link">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="footer-social-link">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="footer-section-title">Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#home" className="footer-link">Home</a></li>
                <li><a href="#features" className="footer-link">Features</a></li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('view-memory')}
                    className="footer-button"
                  >
                    Gallery
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('journey-tracker')}
                    className="footer-button"
                  >
                    Journey
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('anniversary-reminders')}
                    className="footer-button"
                  >
                    Reminders
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('pdf-export')}
                    className="footer-button"
                  >
                    Export PDF
                  </button>
                </li>
                <li><a href="#download" className="footer-link">Download</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="footer-section-title">Contact Us</h3>
              <div className="footer-contact">
                <div className="footer-contact-item">
                  <Mail className="w-5 h-5 footer-contact-icon" />
                  <span className="footer-contact-text">hello@lovejournal.com</span>
                </div>
                <div className="footer-contact-item">
                  <Phone className="w-5 h-5 footer-contact-icon" />
                  <span className="footer-contact-text">+1 (555) 123-4567</span>
                </div>
                <div className="footer-contact-item">
                  <MapPin className="w-5 h-5 footer-contact-icon" />
                  <span className="footer-contact-text">San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2024 Love Journal. Made with ❤️ for couples everywhere. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;