// Types for our formatted response
export interface FormattedImage {
  secure_url: string;
  created_at: string;
  caption: string;
  description: string;
  dateselected: string;
  location?: string;
  title?: string;
}

export class CloudinaryGalleryApi {
  /**
   * Fetch images from Cloudinary via serverless API endpoint
   * @returns Promise<FormattedImage[]>
   */
  async fetchImages(): Promise<FormattedImage[]> {
    console.log('No data source configured');
    return [];
  }
}

// Factory function for creating API instance
export const createCloudinaryApi = (): CloudinaryGalleryApi => {
  return new CloudinaryGalleryApi();
};

// Hook for React components
export const useCloudinaryGallery = () => {
  const fetchGalleryImages = async (): Promise<FormattedImage[]> => {
    const api = createCloudinaryApi();
    return api.fetchImages();
  };

  return { fetchGalleryImages };
};

export default CloudinaryGalleryApi;