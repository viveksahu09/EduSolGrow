const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test approved notes endpoint
    console.log('\n1. Testing /api/notes/approved:');
    const approvedResponse = await axios.get('http://localhost:5000/api/notes/approved');
    console.log('Status:', approvedResponse.status);
    console.log('Data length:', approvedResponse.data.length);
    console.log('First note:', approvedResponse.data[0]);
    
    // Test all notes endpoint (requires auth)
    console.log('\n2. Testing /api/notes/all (with admin token):');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const allNotesResponse = await axios.get('http://localhost:5000/api/notes/all', {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.token}`
      }
    });
    console.log('Status:', allNotesResponse.status);
    console.log('Data length:', allNotesResponse.data.length);
    console.log('Notes by status:');
    const statusCounts = allNotesResponse.data.reduce((acc, note) => {
      acc[note.status] = (acc[note.status] || 0) + 1;
      return acc;
    }, {});
    console.log(statusCounts);
    
  } catch (error) {
    console.error('API Test Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testAPI();
