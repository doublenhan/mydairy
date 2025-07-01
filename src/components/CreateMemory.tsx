import React, { useState } from 'react';
import { Heart, Camera, Calendar, Save, ArrowLeft, X, Upload, MapPin, Type } from 'lucide-react';
import axios from 'axios';

// Cloudinary config and upload helper
const CLOUD_NAME = 'dhelefhv1';
const UPLOAD_PRESET = 'love_journal_upload';

// Upload with title, caption, description, and location metadata
const uploadToCloudinaryWithMeta = async (file: File, title: string, textContent: string, location: string, dateSelected: string) => {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  // Set title, caption, description, location, and dateselected in context
  formData.append('context', `title=${title}|caption=${textContent}|description=${textContent}|location=${location}|dateselected=${dateSelected}`);
  console.log('Uploading to Cloudinary with metadata:', {
    file: file.name,
    title: title,
    caption: textContent,
    description: textContent,
    location: location,
    dateselected: dateSelected
  });
  const response = await axios.post(url, formData);
  return {
    url: response.data.secure_url,
    public_id: response.data.public_id
  };
};

interface CreateMemoryProps {
  onBack?: () => void;
}

function CreateMemory({ onBack }: CreateMemoryProps) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [memoryText, setMemoryText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setUploadedFile(file);
      setImageUrl(''); // Clear URL input when file is selected
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setUploadedFile(null);
    // Clear file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSave = async () => {
    if (memoryText.trim() && title.trim()) {
      let finalImageUrl = imageUrl;
      
      // If a file is selected, upload it to Cloudinary with metadata
      if (uploadedFile) {
        try {
          console.log('Uploading image to Cloudinary...', uploadedFile);
          const uploadResult = await uploadToCloudinaryWithMeta(uploadedFile, title, memoryText, location, selectedDate);
          console.log('Upload result:', uploadResult);
          finalImageUrl = uploadResult.url;
        } catch (err) {
          console.error('Upload error:', err);
          alert('Failed to upload image. Please try again.');
          return;
        }
      }

      // Here you would typically save to your backend/database
      console.log('Saving memory:', {
        title: title,
        text: memoryText,
        location: location,
        date: selectedDate,
        imageUrl: finalImageUrl
      });
      
      // Show success message
      alert('Memory saved successfully! 💕');
      
      // Reset form
      setTitle('');
      setLocation('');
      setMemoryText('');
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setImageUrl('');
      setUploadedFile(null);
      setImagePreview('');
    }
  };

  const isFormValid = memoryText.trim().length > 0 && title.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden">
          {/* Page Header */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-12 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Create New Memory
            </h1>
            <p className="text-pink-100 text-lg">
              Capture this beautiful moment forever
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-8">
            {/* Date Selection */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                <Calendar className="w-5 h-5 text-pink-500" />
                <span>When did this happen?</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100"
              />
            </div>

            {/* Title Field */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                <Type className="w-5 h-5 text-pink-500" />
                <span>Memory Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your memory a beautiful title..."
                className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100"
              />
            </div>

            {/* Location Field */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                <MapPin className="w-5 h-5 text-pink-500" />
                <span>Location (optional)</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where did this happen? (e.g., Paris, Our favorite café...)"
                className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100"
              />
            </div>

            {/* Memory Text */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                <Heart className="w-5 h-5 text-pink-500" />
                <span>Tell your story</span>
              </label>
              <textarea
                value={memoryText}
                onChange={(e) => setMemoryText(e.target.value)}
                placeholder="Write about this special moment... What made it magical? How did it make you feel?"
                rows={8}
                className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100 resize-none"
              />
              <div className="text-right text-sm text-gray-500">
                {memoryText.length} characters
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                <Camera className="w-5 h-5 text-pink-500" />
                <span>Add photos</span>
              </label>
              
              {/* Image URL Input */}
              <input
                type="text"
                placeholder="Enter image URL (optional)..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100"
                disabled={!!uploadedFile}
              />

              {/* Upload Area */}
              <div className="relative">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <label htmlFor="file-upload" className="border-2 border-dashed border-pink-200 rounded-xl p-8 text-center transition-all duration-200 hover:border-pink-300 hover:bg-pink-50 cursor-pointer block">
                  <Upload className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">
                    Click to upload photos or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </label>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-24 sm:h-32 object-cover rounded-lg shadow-md"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-pink-100">
              <button
                onClick={handleSave}
                disabled={!isFormValid}
                className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isFormValid 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 hover:scale-102 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-5 h-5" />
                <span>Save Memory</span>
              </button>
              
              {!isFormValid && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Please add a title and write your memory to save it
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <span>Tips for capturing memories</span>
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start space-x-2">
              <span className="text-pink-400 mt-1">•</span>
              <span>Choose a meaningful title that captures the essence of your memory</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-pink-400 mt-1">•</span>
              <span>Include details about what made this moment special</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-pink-400 mt-1">•</span>
              <span>Describe your feelings and emotions in that moment</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-pink-400 mt-1">•</span>
              <span>Add location and photos to bring your memory to life</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-pink-400 mt-1">•</span>
              <span>Don't worry about perfect writing - authenticity matters most</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default CreateMemory;