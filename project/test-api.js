// Test API directly
const testAPI = async () => {
  try {
    console.log('Testing API...');
    const res = await fetch('https://diaryjournal.vercel.app/api/cloudinaryGalleryApi');
    console.log('Status:', res.status);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
    
    const data = await res.json();
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('Length:', data.length);
    
  } catch (err) {
    console.error('Error:', err.message);
  }
};

testAPI();
