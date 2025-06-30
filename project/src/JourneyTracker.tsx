import React, { useState, useEffect } from 'react';
import { Heart, Calendar, ArrowLeft, Star, Camera, Sparkles, Award, Loader2, AlertCircle, RefreshCw, MapPin } from 'lucide-react';
import './styles/JourneyTracker.css';

interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  location?: string;
  type: 'first_date' | 'anniversary' | 'trip' | 'engagement' | 'moving_in' | 'special_moment';
  mood: 'ecstatic' | 'happy' | 'romantic' | 'nostalgic' | 'excited' | 'peaceful';
  icon: React.ReactNode;
  isUpcoming?: boolean;
  photos?: string[];
  achievement?: {
    title: string;
    description: string;
    badge: React.ReactNode;
  };
}

interface JourneyTrackerProps {
  onBack?: () => void;
}

function JourneyTracker({ onBack }: JourneyTrackerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [celebrationActive, setCelebrationActive] = useState<string | null>(null);
  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; type: 'heart' | 'star' | 'sparkle' }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load milestones from API - using exact pattern from ViewMemory
  useEffect(() => {
    const loadMilestonesFromAPI = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = '/api/cloudinaryGalleryApi';
        const res = await fetch(apiUrl);
        
        if (!res.ok) throw new Error('API not reachable');
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('JourneyTracker - API response is not JSON:', text);
          setMilestones([]);
          return;
        }
        
        const data = await res.json();
        
        if (!Array.isArray(data)) {
          throw new Error('API response is not an array');
        }
        
        // Filter and process entries with current API structure
        const entries = data
          .map((img: any) => {
            // Extract from current API structure (caption as title, description as content)
            return {
              url: img.url || img.secure_url || '',
              title: img.caption || 'Love Memory',
              description: img.description || img.caption || 'A beautiful moment captured in our journey together',
              location: '', 
              dateSelected: img.dateSelected ? new Date(img.dateSelected) : 
                           new Date(img.created_at || Date.now())
            };
          })
          .filter((e: any) => {
            const isValid = e.url && e.dateSelected;
            return isValid;
          })
          .sort((a: any, b: any) => a.dateSelected.getTime() - b.dateSelected.getTime());
        
        // Convert to Milestone format with all fields
        const formattedMilestones: Milestone[] = entries.map((entry: any, index: number) => {
          const date = entry.dateSelected.toISOString().split('T')[0];
          const title = entry.title;
          const description = entry.description;
          const location = entry.location;
          
          return {
            id: `milestone-${index}`,
            date: date,
            title: title,
            description: description,
            location: location,
            type: 'special_moment' as Milestone['type'],
            mood: 'happy' as Milestone['mood'],
            icon: <Heart className="w-6 h-6" />,
            photos: [entry.url],
            achievement: {
              title: title,
              description: description,
              badge: <Award className="w-8 h-8 text-yellow-500" />
            }
          };
        });       
        setMilestones(formattedMilestones);  
      } catch (err: any) {
        setError(err.message || 'Failed to load milestones from API');
        setMilestones([]);
      } finally {
        setLoading(false);
      }
    };

    loadMilestonesFromAPI();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap = {
      ecstatic: '🥰',
      happy: '😊',
      romantic: '💕',
      nostalgic: '🥺',
      excited: '🤩',
      peaceful: '😌'
    };
    return moodMap[mood as keyof typeof moodMap] || '😊';
  };

  const getMoodColor = (mood: string) => {
    const colorMap = {
      ecstatic: 'from-pink-400 to-rose-400',
      happy: 'from-yellow-400 to-orange-400',
      romantic: 'from-red-400 to-pink-400',
      nostalgic: 'from-purple-400 to-indigo-400',
      excited: 'from-blue-400 to-cyan-400',
      peaceful: 'from-green-400 to-teal-400'
    };
    return colorMap[mood as keyof typeof colorMap] || 'from-pink-400 to-rose-400';
  };

  const celebrateMilestone = (milestone: Milestone, event: React.MouseEvent) => {
    setCelebrationActive(milestone.id);
    
    // Create floating elements
    const rect = event.currentTarget.getBoundingClientRect();
    const elements = [];
    
    for (let i = 0; i < 15; i++) {
      elements.push({
        id: Date.now() + i,
        x: rect.left + Math.random() * rect.width,
        y: rect.top + Math.random() * rect.height,
        type: ['heart', 'star', 'sparkle'][Math.floor(Math.random() * 3)] as 'heart' | 'star' | 'sparkle'
      });
    }
    
    setFloatingElements(elements);
    
    // Clear celebration after animation
    setTimeout(() => {
      setCelebrationActive(null);
      setFloatingElements([]);
    }, 3000);
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="journey-tracker-page">
      {/* Header */}
      <header className="journey-header">
        <div className="journey-header-container">
          <div className="journey-header-content">
            <button 
              onClick={onBack}
              className="back-button"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="back-button-text">Back</span>
            </button>
            
            <div className="header-logo">
              <div className="header-logo-icon">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="header-logo-text">Love Journal</span>
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="journey-main">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading your love journey...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
            <p className="text-red-600 mb-4">Failed to load milestones from API</p>
            <p className="text-gray-500 mb-4 text-sm">Please check your API connection</p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Page Header */}
        {!loading && (
          <>
            <div className="page-header">
              <h1 className="page-title">
                Our Love
                <span className="gradient-text"> Journey</span>
              </h1>
              <p className="page-subtitle">
                Track your relationship's beautiful milestones and celebrate every precious moment together
              </p>
            </div>

            {/* Journey Timeline */}
            <div className="timeline-container">
          <div className="timeline-line"></div>
          
          {milestones.map((milestone, index) => (
            <div 
              key={milestone.id}
              className={`milestone-item ${milestone.isUpcoming ? 'milestone-upcoming' : ''} ${
                celebrationActive === milestone.id ? 'milestone-celebrating' : ''
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Timeline Node */}
              <div className="timeline-node">
                <div className={`timeline-icon bg-gradient-to-r ${getMoodColor(milestone.mood)}`}>
                  {milestone.icon}
                </div>
                {milestone.isUpcoming && (
                  <div className="upcoming-pulse"></div>
                )}
              </div>

              {/* Milestone Card */}
              <div 
                className="milestone-card"
                onClick={(e) => celebrateMilestone(milestone, e)}
              >
                {/* Card Header */}
                <div className="milestone-header">
                  <div className="milestone-date">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(milestone.date)}</span>
                    {milestone.isUpcoming && (
                      <span className="upcoming-badge">
                        {getDaysUntil(milestone.date)} days to go!
                      </span>
                    )}
                  </div>
                  
                  <div className="mood-indicator">
                    <span className="mood-emoji">{getMoodEmoji(milestone.mood)}</span>
                    <span className="mood-text">{milestone.mood}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="milestone-content">
                  <h3 className="milestone-title">{milestone.title}</h3>
                  <p className="milestone-description">{milestone.description}</p>
                  
                  {/* Location */}
                  {milestone.location && milestone.location.trim() && (
                    <div className="milestone-location">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="location-text">{milestone.location}</span>
                    </div>
                  )}
                  
                  {/* Photos */}
                  {milestone.photos && milestone.photos.length > 0 && (
                    <div className="milestone-photos">
                      {milestone.photos.slice(0, 3).map((photo, photoIndex) => (
                        <img
                          key={photoIndex}
                          src={photo}
                          alt={`${milestone.title} photo ${photoIndex + 1}`}
                          className="milestone-photo"
                        />
                      ))}
                      {milestone.photos.length > 3 && (
                        <div className="photo-count">
                          +{milestone.photos.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Achievement Badge */}
                {milestone.achievement && (
                  <div className="achievement-badge">
                    <div className="achievement-icon">
                      {milestone.achievement.badge}
                    </div>
                    <div className="achievement-text">
                      <h4 className="achievement-title">{milestone.achievement.title}</h4>
                      <p className="achievement-description">{milestone.achievement.description}</p>
                    </div>
                  </div>
                )}

                {/* Celebration Effects */}
                {celebrationActive === milestone.id && (
                  <div className="celebration-overlay">
                    <div className="celebration-text">🎉 Celebrating! 🎉</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {milestones.length === 0 && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-20">
            <Heart className="w-16 h-16 text-pink-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No milestones found</h3>
            <p className="text-gray-500 text-center max-w-md">Upload some photos with meaningful titles and descriptions to see your love journey milestones here!</p>
          </div>
        )}

        {/* Stats Section */}
        {milestones.length > 0 && (
        <div className="stats-section">
          <h2 className="stats-title">Your Love Story by the Numbers</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <div className="stat-number">{milestones.length}</div>
              <div className="stat-label">Milestones</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
              <div className="stat-number">
                {Math.floor((new Date().getTime() - new Date(milestones[0]?.date || '').getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="stat-label">Days Together</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <Camera className="w-8 h-8 text-green-500" />
              </div>
              <div className="stat-number">
                {milestones.reduce((total, milestone) => total + (milestone.photos?.length || 0), 0)}
              </div>
              <div className="stat-label">Photos Shared</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="stat-number">
                {milestones.filter(m => m.achievement).length}
              </div>
              <div className="stat-label">Achievements</div>
            </div>
          </div>
        </div>
        )}
          </>
        )}
      </main>

      {/* Floating Celebration Elements */}
      {floatingElements.map(element => (
        <div
          key={element.id}
          className={`floating-element floating-${element.type}`}
          style={{
            left: element.x,
            top: element.y,
          }}
        >
          {element.type === 'heart' && <Heart className="w-4 h-4 fill-current text-pink-500" />}
          {element.type === 'star' && <Star className="w-4 h-4 fill-current text-yellow-500" />}
          {element.type === 'sparkle' && <Sparkles className="w-4 h-4 fill-current text-purple-500" />}
        </div>
      ))}
    </div>
  );
}

export default JourneyTracker;