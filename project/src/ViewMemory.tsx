import React, { useState, useEffect } from 'react';
import { Heart, Calendar, ArrowLeft, X, ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import './styles/ViewMemory.css';

interface Memory {
  id: string;
  date: string;
  content: string;
  photos: string[];
  title?: string;
  description?: string;
  location?: string;
}

interface ViewMemoryProps {
  onBack?: () => void;
}

function ViewMemory({ onBack }: ViewMemoryProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [allPhotos, setAllPhotos] = useState<string[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load memories from API following ViewJournalFromCloudinary pattern
  useEffect(() => {
    const loadMemoriesFromAPI = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = '/api/cloudinaryGalleryApi';
        const res = await fetch(apiUrl);
        
        if (!res.ok) throw new Error('API not reachable');
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('API response is not JSON:', text);
          setMemories([]);
          return;
        }
        
        const data = await res.json();
        
        console.log('ViewMemory - Raw API data:', data);
        console.log('ViewMemory - Data type:', typeof data);
        console.log('ViewMemory - Is array:', Array.isArray(data));
        
        if (!Array.isArray(data)) {
          throw new Error('API response is not an array');
        }
        
        // Filter and process entries with current API structure
        const entries = data
          .map((img: any, index: number) => {
            console.log(`ViewMemory - Processing item ${index}:`, img);
            
            // Extract from current API structure (caption as title, description as content)
            return {
              url: img.url || img.secure_url || '',
              title: img.caption || 'Love Memory',
              caption: img.caption || 'Love Memory',
              description: img.description || img.caption || 'A beautiful memory captured in time',
              location: '', // Not available in current API structure
              dateSelected: img.dateSelected ? new Date(img.dateSelected) : 
                           new Date(img.created_at || Date.now())
            };
          })
          .filter((e: any) => {
            const isValid = e.url && e.dateSelected;
            console.log('ViewMemory - Item valid?', isValid, e);
            return isValid;
          })
          .sort((a: any, b: any) => b.dateSelected.getTime() - a.dateSelected.getTime());

        // Group images by date and create memories
        const memoriesByDate: { [key: string]: any[] } = {};
        
        entries.forEach((entry: any) => {
          const date = entry.dateSelected.toISOString().split('T')[0];
          if (!memoriesByDate[date]) {
            memoriesByDate[date] = [];
          }
          memoriesByDate[date].push(entry);
        });

        // Convert to Memory format with all metadata
        const formattedMemories: Memory[] = Object.entries(memoriesByDate).map(([date, images], index) => {
          const firstImage = images[0];
          return {
            id: `memory-${index}`,
            date: date,
            content: firstImage.caption,
            title: firstImage.title,
            description: firstImage.description,
            location: firstImage.location,
            photos: images.map(img => img.url)
          };
        });
        
        setMemories(formattedMemories);
        
        // Collect all photos for the gallery
        const photos = formattedMemories.flatMap(memory => memory.photos);
        setAllPhotos(photos);
        
      } catch (err: any) {
        console.error('Error loading memories:', err);
        setError(err.message || 'Failed to load memories from API');
        setMemories([]);
      } finally {
        setLoading(false);
      }
    };

    loadMemoriesFromAPI();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openLightbox = (photo: string) => {
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(allPhotos.indexOf(photo));
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (selectedPhotoIndex - 1 + allPhotos.length) % allPhotos.length
      : (selectedPhotoIndex + 1) % allPhotos.length;
    
    setSelectedPhotoIndex(newIndex);
    setSelectedPhoto(allPhotos[newIndex]);
  };

  const createFloatingHeart = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const heartId = Date.now() + Math.random();
    setFloatingHearts(prev => [...prev, { id: heartId, x, y }]);
    
    // Remove heart after animation
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => heart.id !== heartId));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Love Journal
              </span>
            </div>
            
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading your beautiful memories...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
            <p className="text-red-600 mb-4">Failed to load memories from API</p>
            <p className="text-gray-500 mb-4 text-sm">Please check your API connection</p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}        {/* Page Header */}
        {!loading && (
          <>
            <div className="page-header">
              <h1 className="page-title">
                Our Love
                <span className="gradient-text"> Memories</span>
              </h1>
              <p className="page-subtitle">
                Every moment we've shared, every laugh, every adventure - all captured here in our digital love story.
              </p>
            </div>

            {/* Memories Timeline */}
            <div className="memory-timeline">
          {memories.map((memory, memoryIndex) => (
            <div 
              key={memory.id} 
              className="memory-card animate-fade-in"
              style={{ animationDelay: `${memoryIndex * 0.2}s` }}
            >
              {/* Memory Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                {/* Date Header */}
                <div className="date-header">
                  <div className="flex items-center justify-center space-x-2 text-white">
                    <Calendar className="w-5 h-5" />
                    <span className="date-text">{formatDate(memory.date)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Memory Title */}
                  {memory.title && (
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {memory.title}
                    </h3>
                  )}
                  
                  {/* Memory Description */}
                  {memory.description && memory.description !== memory.title && (
                    <p className="text-sm text-gray-600 mb-4 italic">
                      {memory.description}
                    </p>
                  )}
                  
                  <p className="memory-content">
                    {memory.content}
                  </p>

                  {/* Photos Grid - Staggered Layout */}
                  {memory.photos.length > 0 && (
                    <div className="relative">
                      {memory.photos.length === 1 && (
                        <div className="photo-grid-single">
                          <div 
                            className="photo-item transform hover:scale-105 transition-all duration-300"
                            onClick={(e) => {
                              createFloatingHeart(e);
                              openLightbox(memory.photos[0]);
                            }}
                          >
                            <img
                              src={memory.photos[0]}
                              alt="Memory"
                              className="w-full max-w-md h-64 sm:h-80 object-cover rounded-2xl shadow-lg"
                            />
                            <div className="photo-overlay" />
                          </div>
                        </div>
                      )}

                      {memory.photos.length === 2 && (
                        <div className="photo-grid-double">
                          {memory.photos.map((photo, photoIndex) => (
                            <div 
                              key={photoIndex}
                              className={`photo-item transform hover:scale-105 transition-all duration-300 ${
                                photoIndex === 1 ? 'sm:mt-8' : ''
                              }`}
                              onClick={(e) => {
                                createFloatingHeart(e);
                                openLightbox(photo);
                              }}
                            >
                              <img
                                src={photo}
                                alt={`Memory ${photoIndex + 1}`}
                                className="w-full h-64 object-cover rounded-2xl shadow-lg"
                              />
                              <div className="photo-overlay" />
                            </div>
                          ))}
                        </div>
                      )}

                      {memory.photos.length >= 3 && (
                        <div className="photo-grid-multiple">
                          {memory.photos.map((photo, photoIndex) => (
                            <div 
                              key={photoIndex}
                              className={`photo-item transform hover:scale-105 transition-all duration-300 ${
                                photoIndex % 3 === 1 ? 'photo-stagger-1' : ''
                              } ${
                                photoIndex % 3 === 2 ? 'photo-stagger-2' : ''
                              }`}
                              onClick={(e) => {
                                createFloatingHeart(e);
                                openLightbox(photo);
                              }}
                            >
                              <img
                                src={photo}
                                alt={`Memory ${photoIndex + 1}`}
                                className="w-full h-48 sm:h-56 object-cover rounded-2xl shadow-lg"
                              />
                              <div className="photo-overlay" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Floating Hearts */}
                      {floatingHearts.map(heart => (
                        <div
                          key={heart.id}
                          className="floating-heart animate-float-heart"
                          style={{
                            left: heart.x,
                            top: heart.y,
                          }}
                        >
                          <Heart className="w-6 h-6 fill-current" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {memories.length === 0 && !loading && !error && (
          <div className="empty-state">
            <Heart className="empty-state-icon" />
            <h3 className="empty-state-title">No memories found</h3>
            <p className="empty-state-text">Upload some photos to start creating your memories!</p>
          </div>
        )}
          </>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="lightbox-overlay animate-fade-in">
          <div className="lightbox-container">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="lightbox-close"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            {allPhotos.length > 1 && (
              <>
                <button
                  onClick={() => navigatePhoto('prev')}
                  className="lightbox-nav lightbox-nav-prev"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() => navigatePhoto('next')}
                  className="lightbox-nav lightbox-nav-next"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={selectedPhoto}
              alt="Memory"
              className="lightbox-image animate-zoom-in"
            />

            {/* Photo Counter */}
            {allPhotos.length > 1 && (
              <div className="lightbox-counter">
                {selectedPhotoIndex + 1} of {allPhotos.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewMemory;