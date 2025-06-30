// Types for our formatted response
export interface FormattedImage {
  url: string;
  created_at: string;
  caption: string;
  description: string;
  dateSelected: string;
  location?: string;
  title?: string;
}

// Environment variables interface
interface CloudinaryConfig {
  CLOUD_NAME: string;
  API_KEY: string;
  API_SECRET: string;
}

export class CloudinaryGalleryApi {
  private config: CloudinaryConfig;

  constructor(config: CloudinaryConfig) {
    this.config = config;
  }

  /**
   * Fetch images from Cloudinary with metadata
   * This method would need to be implemented with proper backend integration
   * @returns Promise<FormattedImage[]>
   */
  async fetchImages(): Promise<FormattedImage[]> {
    try {
      const { CLOUD_NAME } = this.config;

      // TODO: Implement actual Cloudinary API integration
      // This requires backend API or proper authentication setup
      console.log('Cloudinary cloud name:', CLOUD_NAME);
      
      // For now, return empty array - no sample data
      return [];
      
    } catch (err: any) {
      console.error('Cloudinary API error:', {
        message: err.message,
        stack: err.stack,
      });
      throw new Error('Failed to fetch images from Cloudinary.');
    }
  }
}

// Factory function for creating API instance
export const createCloudinaryApi = (config: CloudinaryConfig): CloudinaryGalleryApi => {
  return new CloudinaryGalleryApi(config);
};

// Hook for React components
export const useCloudinaryGallery = () => {
  const fetchGalleryImages = async (): Promise<FormattedImage[]> => {
    const config: CloudinaryConfig = {
      CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 
                  import.meta.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
      API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY || 
               import.meta.env.REACT_APP_CLOUDINARY_API_KEY || '',
      API_SECRET: import.meta.env.VITE_CLOUDINARY_API_SECRET || 
                  import.meta.env.REACT_APP_CLOUDINARY_API_SECRET || '',
    };

    if (!config.CLOUD_NAME) {
      console.error('Cloudinary config:', config);
      throw new Error('Missing Cloudinary cloud name configuration.');
    }

    const api = createCloudinaryApi(config);
    return api.fetchImages();
  };

  return { fetchGalleryImages };
};

// Default export for compatibility
export default CloudinaryGalleryApi;
