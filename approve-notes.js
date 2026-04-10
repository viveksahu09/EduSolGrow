const axios = require('axios');

async function approveNotes() {
  try {
    console.log('Approving test notes...');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Logged in as admin');
    
    // Get all notes
    const notesResponse = await axios.get('http://localhost:5000/api/notes/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const notes = notesResponse.data;
    console.log(`Found ${notes.length} notes`);
    
    // Approve first 2 notes for student testing
    for (let i = 0; i < Math.min(2, notes.length); i++) {
      const note = notes[i];
      console.log(`Approving: ${note.title}`);
      
      await axios.patch(`http://localhost:5000/api/notes/${note._id}/review`, 
        { status: 'approved' },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log(`✅ Approved: ${note.title}`);
    }
    
    console.log('\n🎉 Notes approved successfully!');
    console.log('Students can now see the approved notes in the Notes section.');
    console.log('Admin can still see all notes (pending + approved) in the dashboard.');
    
  } catch (error) {
    console.error('Error approving notes:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

approveNotes();
