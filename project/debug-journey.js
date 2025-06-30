// Test script to debug JourneyTracker API issue
const fetch = require('node-fetch');

async function testJourneyTrackerAPI() {
  try {
    console.log('Testing JourneyTracker API integration...');
    
    const apiUrl = 'https://diaryjournal.vercel.app/api/cloudinaryGalleryApi';
    const res = await fetch(apiUrl);
    
    console.log('Response status:', res.status);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      console.log('Response not OK');
      return;
    }
    
    const contentType = res.headers.get('content-type');
    console.log('Content type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('API response is not JSON:', text);
      return;
    }
    
    const data = await res.json();
    
    console.log('Raw API data:', data);
    console.log('Data type:', typeof data);
    console.log('Is array:', Array.isArray(data));
    
    if (!Array.isArray(data)) {
      console.log('API response is not an array');
      return;
    }
    
    // Convert API data to milestones
    const milestoneData = data
      .map((img, index) => {
        console.log(`Processing item ${index}:`, img);
        return {
          url: img.url || img.secure_url || '',
          caption: img.caption || 'Love Memory',
          description: img.description || img.caption || 'A beautiful moment captured in our journey together',
          dateSelected: img.dateSelected ? new Date(img.dateSelected) : new Date(img.created_at || Date.now())
        };
      })
      .filter((e) => {
        const isValid = e.url && e.dateSelected;
        console.log('Item valid?', isValid, e);
        return isValid;
      })
      .sort((a, b) => a.dateSelected.getTime() - b.dateSelected.getTime());

    console.log('Processed milestone data:', milestoneData);
    console.log('Milestone data length:', milestoneData.length);

    // Check if we'd have milestones
    console.log('Would create milestones:', milestoneData.length > 0);
    console.log('Sample milestone data:', milestoneData[0]);
    
  } catch (err) {
    console.error('Error in test:', err);
  }
}

testJourneyTrackerAPI();
