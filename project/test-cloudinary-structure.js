// Test Cloudinary API response structure
const testCloudinaryAPI = async () => {
  try {
    const response = await fetch('https://diaryjournal.vercel.app/api/cloudinaryGalleryApi');
    const data = await response.json();
    
    console.log('=== CLOUDINARY API TEST ===');
    console.log('Total items:', data.length);
    console.log('First item full structure:', JSON.stringify(data[0], null, 2));
    console.log('All available fields:', Object.keys(data[0]));
    
    // Check all items for different field structures
    data.forEach((item, index) => {
      console.log(`\n--- Item ${index} ---`);
      console.log('Fields:', Object.keys(item));
      if (item.caption) console.log('Caption:', item.caption);
      if (item.description) console.log('Description:', item.description);
      if (item.dateSelected) console.log('DateSelected:', item.dateSelected);
    });
    
  } catch (error) {
    console.error('Error testing Cloudinary API:', error);
  }
};

testCloudinaryAPI();
