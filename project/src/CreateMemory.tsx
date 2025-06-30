import React, { useState } from 'react';
import { Heart, Camera, Calendar, Save, ArrowLeft, X, Upload, MapPin, Type } from 'lucide-react';
import axios from 'axios';
import './styles/CreateMemory.css';

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
    <div className="create-memory-page">
      {/* Header */}
      <header className="create-memory-header">
        <div className="create-memory-header-container">
          <div className="create-memory-header-content">
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
              <span className="header-logo-text">
                Love Journal
              </span>
            </div>
            
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="create-memory-main">
        <div className="memory-card">
          {/* Page Header */}
          <div className="memory-card-header">
            <h1 className="memory-card-title">
              Create New Memory
            </h1>
            <p className="memory-card-subtitle">
              Capture this beautiful moment forever
            </p>
          </div>

          {/* Form Content */}
          <div className="form-content">
            {/* Date Selection */}
            <div className="form-section">
              <label className="form-label">
                <Calendar className="w-5 h-5 form-label-icon" />
                <span>When did this happen?</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Title Field */}
            <div className="form-section">
              <label className="form-label">
                <Type className="w-5 h-5 form-label-icon" />
                <span>Memory Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your memory a beautiful title..."
                className="form-input"
              />
            </div>

            {/* Location Field */}
            <div className="form-section">
              <label className="form-label">
                <MapPin className="w-5 h-5 form-label-icon" />
                <span>Location (optional)</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where did this happen? (e.g., Paris, Our favorite café...)"
                className="form-input"
              />
            </div>

            {/* Memory Text */}
            <div className="form-section">
              <label className="form-label">
                <Heart className="w-5 h-5 form-label-icon" />
                <span>Tell your story</span>
              </label>
              <textarea
                value={memoryText}
                onChange={(e) => setMemoryText(e.target.value)}
                placeholder="Write about this special moment... What made it magical? How did it make you feel?"
                rows={8}
                className="form-textarea"
              />
              <div className="character-counter">
                {memoryText.length} characters
              </div>
            </div>

            {/* Image Upload */}
            <div className="upload-section">
              <label className="form-label">
                <Camera className="w-5 h-5 form-label-icon" />
                <span>Add photos</span>
              </label>
              
              {/* Image URL Input */}
              <div className="form-section">
                <input
                  type="text"
                  placeholder="Enter image URL (optional)..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="form-input"
                  disabled={!!uploadedFile}
                />
              </div>

              {/* Upload Area */}
              <div className="upload-area">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="upload-input"
                />
                <label htmlFor="file-upload" className="upload-dropzone">
                  <Upload className="upload-icon" />
                  <p className="upload-text">
                    Click to upload photos or drag and drop
                  </p>
                  <p className="upload-subtext">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </label>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="image-previews">
                  <div className="image-preview">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="image-preview-img"
                    />
                    <button
                      onClick={removeImage}
                      className="image-remove-button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="save-section">
              <button
                onClick={handleSave}
                disabled={!isFormValid}
                className={`save-button ${
                  isFormValid ? 'save-button-enabled' : 'save-button-disabled'
                }`}
              >
                <Save className="w-5 h-5" />
                <span>Save Memory</span>
              </button>
              
              {!isFormValid && (
                <p className="save-validation-message">
                  Please add a title and write your memory to save it
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <h3 className="tips-title">
            <Heart className="w-5 h-5 tips-title-icon" />
            Tips for capturing memories
          </h3>
          <ul className="tips-list">
            <li className="tips-item">
              <span className="tips-bullet">•</span>
              <span className="tips-text">Choose a meaningful title that captures the essence of your memory</span>
            </li>
            <li className="tips-item">
              <span className="tips-bullet">•</span>
              <span className="tips-text">Include details about what made this moment special</span>
            </li>
            <li className="tips-item">
              <span className="tips-bullet">•</span>
              <span className="tips-text">Describe your feelings and emotions in that moment</span>
            </li>
            <li className="tips-item">
              <span className="tips-bullet">•</span>
              <span className="tips-text">Add location and photos to bring your memory to life</span>
            </li>
            <li className="tips-item">
              <span className="tips-bullet">•</span>
              <span className="tips-text">Don't worry about perfect writing - authenticity matters most</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default CreateMemory;