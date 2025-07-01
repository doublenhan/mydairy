import React, { useState, useEffect } from 'react';
import { Heart, Calendar, ArrowLeft, X, ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useCloudinaryGallery } from '../api/cloudinaryGalleryApi';

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

  // Use the Cloudinary API hook
  const { fetchGalleryImages } = useCloudinaryGallery();

  // Load memories from API using the Cloudinary API hook
  useEffect(() => {
    const loadMemoriesFromAPI = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the Cloudinary API hook
        const data = await fetchGalleryImages();
        
        console.log('ViewMemory - Raw API data:', data);
        console.log('ViewMemory - Data type:', typeof data);
        console.log('ViewMemory - Is array:', Array.isArray(data));
        
        if (!Array.isArray(data)) {
          throw new Error('API response is not an array');
        }
        
        // Filter and process entries with serverless API structure
        const entries = data
          .map((img: any, index: number) => {
            console.log(`ViewMemory - Processing item ${index}:`, img);
            
            // Extract from serverless API response structure
            return {
              url: img.secure_url || '',
              title: img.title || img.caption || 'Love Memory',
              caption: img.caption || 'Love Memory',
              description: img.description || img.caption || 'A beautiful memory captured in time',
              location: img.location || '',
              dateSelected: img.dateselected ? new Date(img.dateselected) : 
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
  }, [fetchGalleryImages]);

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
        )}

        {/* Page Header */}
        {!loading && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Our Love
                <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"> Memories</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Every moment we've shared, every laugh, every adventure - all captured here in our digital love story.
              </p>
            </div>

            {/* Memories Timeline */}
            <div className="space-y-16">
              {memories.map((memory, memoryIndex) => (
                <div 
                  key={memory.id} 
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: `${memoryIndex * 0.2}s`, animationFillMode: 'forwards' }}
                >
                  {/* Memory Card */}
                  <div className="bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                    {/* Date Header */}
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
                      <div className="flex items-center justify-center space-x-2 text-white">
                        <Calendar className="w-5 h-5" />
                        <span className="font-semibold text-lg">{formatDate(memory.date)}</span>
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
                      
                      <p className="text-lg text-gray-700 leading-relaxed mb-8 font-light">
                        {memory.content}
                      </p>

                      {/* Photos Grid - Staggered Layout */}
                      {memory.photos.length > 0 && (
                        <div className="relative">
                          {memory.photos.length === 1 && (
                            <div className="flex justify-center">
                              <div 
                                className="relative cursor-pointer transform hover:scale-105 transition-all duration-300"
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                              </div>
                            </div>
                          )}

                          {memory.photos.length === 2 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              {memory.photos.map((photo, photoIndex) => (
                                <div 
                                  key={photoIndex}
                                  className={`relative cursor-pointer transform hover:scale-105 transition-all duration-300 ${
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
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                </div>
                              ))}
                            </div>
                          )}

                          {memory.photos.length >= 3 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {memory.photos.map((photo, photoIndex) => (
                                <div 
                                  key={photoIndex}
                                  className={`relative cursor-pointer transform hover:scale-105 transition-all duration-300 ${
                                    photoIndex % 3 === 1 ? 'mt-4' : ''
                                  } ${
                                    photoIndex % 3 === 2 ? 'mt-8' : ''
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
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Floating Hearts */}
                          {floatingHearts.map(heart => (
                            <div
                              key={heart.id}
                              className="absolute pointer-events-none z-20 animate-float-heart"
                              style={{
                                left: heart.x,
                                top: heart.y,
                              }}
                            >
                              <Heart className="w-6 h-6 fill-current text-pink-500" />
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
              <div className="text-center py-20">
                <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No memories found</h3>
                <p className="text-gray-500">Upload some photos to start creating your memories!</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-pink-400 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            {allPhotos.length > 1 && (
              <>
                <button
                  onClick={() => navigatePhoto('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-pink-400 transition-colors z-10 bg-black/50 rounded-full p-2"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() => navigatePhoto('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-pink-400 transition-colors z-10 bg-black/50 rounded-full p-2"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={selectedPhoto}
              alt="Memory"
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Photo Counter */}
            {allPhotos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {selectedPhotoIndex + 1} of {allPhotos.length}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-heart {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-float-heart {
          animation: float-heart 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default ViewMemory;