# Cloudinary API Integration

This folder contains the TypeScript implementation of Cloudinary Gallery API for the Love Journal application.

## Files Structure

```
src/api/
├── cloudinaryGalleryApi.ts      # Core API class and utilities
└── index.ts                     # Exports for easy importing
```

## Features

### ✨ Core API (`cloudinaryGalleryApi.ts`)
- **Type-safe**: Full TypeScript support with proper interfaces
- **Error handling**: Comprehensive error catching and logging
- **Configuration**: Environment-based configuration
- **Extensible**: Class-based design for easy extension

### 🎨 Gallery Component (`CloudinaryGallery.tsx`)
- **Interactive selection**: Click to select/deselect images
- **Selection limits**: Configurable maximum selection count
- **Loading states**: Beautiful loading, error, and empty states
- **Image metadata**: Display captions, descriptions, and dates
- **Responsive design**: Works on mobile and desktop

### 🎯 Integration Features
- **React hooks**: `useCloudinaryGallery()` for easy integration
- **PDF Export**: Example integration with PDFExport component
- **Customizable**: Props for styling and behavior customization

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the project root (copy from `.env.example`):

```bash
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
REACT_APP_CLOUDINARY_API_KEY=your_api_key_here
REACT_APP_CLOUDINARY_API_SECRET=your_api_secret_here
```

⚠️ **Security Note**: Never commit your `.env` file with real credentials!

### 2. Get Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your [Dashboard](https://cloudinary.com/console)
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to your `.env` file

### 3. Dependencies

The following dependencies are automatically installed:
- `axios` - HTTP client for API requests
- `lucide-react` - Icons for the UI

## Usage Examples


### Using the API Hook

```tsx
import { useCloudinaryGallery } from './api';

function MyComponent() {
  const { fetchGalleryImages } = useCloudinaryGallery();

  const loadImages = async () => {
    try {
      const images = await fetchGalleryImages();
      console.log('Loaded images:', images);
    } catch (error) {
      console.error('Failed to load images:', error);
    }
  };

  return (
    <button onClick={loadImages}>
      Load Images
    </button>
  );
}
```

### Direct API Usage

```tsx
import { createCloudinaryApi } from './api';

const api = createCloudinaryApi({
  CLOUD_NAME: 'your-cloud-name',
  API_KEY: 'your-api-key',
  API_SECRET: 'your-api-secret'
});

const images = await api.fetchImages();
```

## Image Data Structure

The API returns images with the following structure:

```typescript
interface FormattedImage {
  url: string;          // Secure URL to the image
  created_at: string;   // Creation timestamp
  caption: string;      // Image caption from metadata
  description: string;  // Image description from metadata
  dateSelected: string; // Selected date from metadata
}
```

## Cloudinary Context Metadata

To add metadata to your images in Cloudinary:

1. Upload images to Cloudinary
2. Add context metadata:
   - `caption`: Image caption
   - `description`: Image description  
   - `dateselected`: Date when image was selected

## Error Handling

The API includes comprehensive error handling:

- **Network errors**: Automatic retry suggestions
- **Authentication errors**: Clear credential error messages
- **Missing configuration**: Environment setup guidance
- **API limits**: Graceful handling of rate limits

## Styling

The gallery component includes:
- **Responsive grid**: Adapts to screen size
- **Dark mode**: Automatic dark theme support
- **Animations**: Smooth hover and selection effects
- **Customizable**: Override styles with className prop

## Performance

- **Lazy loading**: Images load as needed
- **Optimized requests**: Efficient API calls
- **Error boundaries**: Graceful failure handling
- **Memory efficient**: Proper cleanup and state management

## Integration with PDFExport

See `PDFExportWithCloudinary.tsx` for a complete example of integrating the gallery with the PDF export functionality.

## Troubleshooting

### Common Issues

1. **"Missing Cloudinary configuration"**
   - Check your `.env` file exists
   - Verify environment variable names
   - Restart your development server

2. **"Failed to fetch images"**
   - Verify your API credentials
   - Check your internet connection
   - Ensure your Cloudinary account is active

3. **Images not displaying**
   - Check image URLs in network tab
   - Verify CORS settings in Cloudinary
   - Check for browser console errors

### Support

For issues with this integration, check:
1. Console errors in browser dev tools
2. Network requests in dev tools
3. Cloudinary dashboard for API usage
4. Environment variable configuration

## Future Enhancements

Potential improvements:
- **Upload functionality**: Direct upload to Cloudinary
- **Batch operations**: Bulk select/deselect
- **Search and filter**: Find specific images
- **Pagination**: Handle large image collections
- **Caching**: Improve performance with local caching
