// Quick API test
async function testAPI() {
  try {
    console.log('Testing API...');
    const apiUrl = 'https://diaryjournal.vercel.app/api/cloudinaryGalleryApi';
    const res = await fetch(apiUrl);
    
    console.log('Response status:', res.status);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      console.error('API not OK:', res.statusText);
      return;
    }
    
    const contentType = res.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    const text = await res.text();
    console.log('Raw response:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('Parsed JSON:', data);
      console.log('Data length:', data.length);
      console.log('First item:', data[0]);
    } catch (e) {
      console.error('JSON parse error:', e);
    }
  } catch (err) {
    console.error('API test error:', err);
  }
}

testAPI();
