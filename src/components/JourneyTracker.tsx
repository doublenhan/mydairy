import React, { useState, useEffect } from 'react';
import { Heart, Calendar, ArrowLeft, Star, Camera, Sparkles, Award, Loader2, AlertCircle, RefreshCw, MapPin } from 'lucide-react';
import { useCloudinaryGallery } from '../api/cloudinaryGalleryApi';

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
  
  // Use the Cloudinary API hook
  const { fetchGalleryImages } = useCloudinaryGallery();

  // Load milestones from API using the Cloudinary API hook
  useEffect(() => {
    const loadMilestonesFromAPI = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the Cloudinary API hook
        const data = await fetchGalleryImages();
        
        if (!Array.isArray(data)) {
          throw new Error('API response is not an array');
        }
        
        // Filter and process entries with serverless API structure
        const entries = data
          .map((img: any) => {
            // Extract from serverless API response structure
            return {
              url: img.secure_url || '',
              title: img.title || img.caption || 'Love Memory',
              description: img.description || img.caption || 'A beautiful moment captured in our journey together',
              location: img.location || '', 
              dateSelected: img.dateselected ? new Date(img.dateselected) : 
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
        console.log('Successfully loaded', formattedMilestones.length, 'milestones');
      } catch (err: any) {
        console.error('Error loading milestones:', err);
        const errorMessage = err.message || 'Failed to load milestones from API';
        console.log('Using fallback data due to:', errorMessage);
        setError(null); 
        setMilestones([]);
      } finally {
        setLoading(false);
      }
    };

    loadMilestonesFromAPI();
  }, [fetchGalleryImages]);

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-all duration-200 hover:-translate-x-1"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl animate-pulse">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Love Journal</span>
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Our Love
                <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"> Journey</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Track your relationship's beautiful milestones and celebrate every precious moment together
              </p>
            </div>

            {/* Journey Timeline */}
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-200 via-pink-300 to-pink-200 z-10"></div>
              
              {milestones.map((milestone, index) => (
                <div 
                  key={milestone.id}
                  className={`relative mb-16 opacity-0 animate-fade-in ${
                    celebrationActive === milestone.id ? 'animate-bounce' : ''
                  }`}
                  style={{ 
                    animationDelay: `${index * 0.2}s`,
                    animationFillMode: 'forwards'
                  }}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-6 md:left-1/2 md:transform md:-translate-x-1/2 top-6 z-20">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getMoodColor(milestone.mood)} flex items-center justify-center text-white shadow-lg border-4 border-white transition-all duration-300 hover:scale-110 hover:shadow-xl`}>
                      {milestone.icon}
                    </div>
                    {milestone.isUpcoming && (
                      <div className="absolute inset-0 rounded-full border-2 border-pink-500 animate-ping"></div>
                    )}
                  </div>

                  {/* Milestone Card */}
                  <div 
                    className={`ml-20 md:ml-0 ${
                      index % 2 === 0 ? 'md:pr-1/2 md:pr-8' : 'md:pl-1/2 md:pl-8'
                    }`}
                  >
                    <div 
                      className="bg-white rounded-3xl shadow-xl border border-pink-100 p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer relative overflow-hidden"
                      onClick={(e) => celebrateMilestone(milestone, e)}
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{formatDate(milestone.date)}</span>
                          {milestone.isUpcoming && (
                            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                              {getDaysUntil(milestone.date)} days to go!
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                          <span className="text-xl">{getMoodEmoji(milestone.mood)}</span>
                          <span className="text-sm font-medium text-pink-600 capitalize">{milestone.mood}</span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{milestone.description}</p>
                        
                        {/* Location */}
                        {milestone.location && milestone.location.trim() && (
                          <div className="flex items-center space-x-2 mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-pink-500">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700 font-medium text-sm">{milestone.location}</span>
                          </div>
                        )}
                        
                        {/* Photos */}
                        {milestone.photos && milestone.photos.length > 0 && (
                          <div className="flex space-x-3 mt-6 flex-wrap">
                            {milestone.photos.slice(0, 3).map((photo, photoIndex) => (
                              <img
                                key={photoIndex}
                                src={photo}
                                alt={`${milestone.title} photo ${photoIndex + 1}`}
                                className="w-16 h-16 object-cover rounded-xl shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
                              />
                            ))}
                            {milestone.photos.length > 3 && (
                              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 font-semibold text-sm border-2 border-dashed border-gray-300">
                                +{milestone.photos.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Achievement Badge */}
                      {milestone.achievement && (
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-4 flex items-center space-x-4">
                          <div className="animate-pulse">
                            {milestone.achievement.badge}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{milestone.achievement.title}</h4>
                            <p className="text-sm text-gray-600">{milestone.achievement.description}</p>
                          </div>
                        </div>
                      )}

                      {/* Celebration Effects */}
                      {celebrationActive === milestone.id && (
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/90 to-rose-500/90 flex items-center justify-center rounded-3xl animate-bounce">
                          <div className="text-white text-2xl font-bold text-center animate-pulse">🎉 Celebrating! 🎉</div>
                        </div>
                      )}

                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {milestones.length === 0 && !loading && !error && (
              <div className="flex flex-col items-center justify-center py-20">
                <Heart className="w-16 h-16 text-pink-300 mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No milestones found</h3>
                <p className="text-gray-500 text-center max-w-md">Upload some photos with meaningful titles and descriptions to see your love journey milestones here!</p>
              </div>
            )}

            {/* Stats Section */}
            {milestones.length > 0 && (
              <div className="mt-24 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">Your Love Story by the Numbers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-pink-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="text-pink-500 mb-4 animate-pulse">
                      <Heart className="w-8 h-8 mx-auto" />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">{milestones.length}</div>
                    <div className="text-gray-600 font-medium">Milestones</div>
                  </div>
                  
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-pink-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="text-blue-500 mb-4 animate-pulse">
                      <Calendar className="w-8 h-8 mx-auto" />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {Math.floor((new Date().getTime() - new Date(milestones[0]?.date || '').getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-gray-600 font-medium">Days Together</div>
                  </div>
                  
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-pink-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="text-green-500 mb-4 animate-pulse">
                      <Camera className="w-8 h-8 mx-auto" />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {milestones.reduce((total, milestone) => total + (milestone.photos?.length || 0), 0)}
                    </div>
                    <div className="text-gray-600 font-medium">Photos Shared</div>
                  </div>
                  
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-pink-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="text-yellow-500 mb-4 animate-pulse">
                      <Award className="w-8 h-8 mx-auto" />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {milestones.filter(m => m.achievement).length}
                    </div>
                    <div className="text-gray-600 font-medium">Achievements</div>
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
          className="fixed pointer-events-none z-50 animate-float-celebration"
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

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-celebration {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-150px) scale(1.5) rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-float-celebration {
          animation: float-celebration 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default JourneyTracker;