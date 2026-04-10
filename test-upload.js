const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Create simple PDF-like files (using images for simplicity)
const createSampleFiles = () => {
  const uploadsDir = path.join(__dirname, 'backend', 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Create simple image files (as placeholders for PDFs)
  const samples = [
    {
      filename: 'mathematics-notes.pdf',
      content: Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Mathematics Notes) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000200 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n256\n%%EOF', 'binary')
    },
    {
      filename: 'physics-notes.pdf',
      content: Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Physics Notes) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000200 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n256\n%%EOF', 'binary')
    },
    {
      filename: 'chemistry-notes.pdf',
      content: Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Chemistry Notes) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000200 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n256\n%%EOF', 'binary')
    }
  ];

  return samples.map(sample => {
    const filePath = path.join(uploadsDir, sample.filename);
    fs.writeFileSync(filePath, sample.content);
    return {
      path: filePath,
      filename: sample.filename,
      originalname: sample.filename
    };
  });
};

// Upload notes function
const uploadNotes = async () => {
  try {
    // First, register a test user if needed
    let token;
    
    try {
      // Try to login with existing test user
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'teststudent@example.com',
        password: 'password123'
      });
      token = loginResponse.data.token;
      console.log('Logged in as test student');
    } catch (error) {
      // Register new test user
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
        username: 'teststudent',
        email: 'teststudent@example.com',
        password: 'password123',
        role: 'student'
      });
      token = registerResponse.data.token;
      console.log('Registered and logged in as test student');
    }

    // Create sample files
    const sampleFiles = createSampleFiles();
    console.log('Created sample files');

    // Upload different notes
    const notesData = [
      {
        title: 'Mathematics Calculus Notes',
        subject: 'Mathematics',
        course: 'B.Tech',
        semester: '1st Semester',
        description: 'Comprehensive notes on calculus including limits, derivatives, and integrals with solved examples.',
        files: [sampleFiles[0]]
      },
      {
        title: 'Physics Mechanics Complete Guide',
        subject: 'Physics',
        course: 'B.Sc',
        semester: '2nd Year',
        description: 'Detailed physics notes covering kinematics, Newton\'s laws, and energy concepts.',
        files: [sampleFiles[1]]
      },
      {
        title: 'Organic Chemistry Fundamentals',
        subject: 'Chemistry',
        course: 'B.Com',
        semester: '3rd Semester',
        description: 'Essential organic chemistry notes including hydrocarbons, functional groups, and reactions.',
        files: [sampleFiles[2]]
      },
      {
        title: 'Mathematics & Physics Combined Notes',
        subject: 'General Science',
        course: 'B.Tech',
        semester: 'Final Year',
        description: 'Combined study material for mathematics and physics with practice problems.',
        files: [sampleFiles[0], sampleFiles[1]] // Multiple files
      }
    ];

    // Upload each note
    for (const noteData of notesData) {
      const formData = new FormData();
      
      // Add files
      noteData.files.forEach(file => {
        formData.append('files', fs.createReadStream(file.path), file.originalname);
      });
      
      // Add other fields
      formData.append('title', noteData.title);
      formData.append('subject', noteData.subject);
      formData.append('course', noteData.course);
      formData.append('semester', noteData.semester);
      formData.append('description', noteData.description);

      try {
        const response = await axios.post('http://localhost:5000/api/notes/upload', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log(`✅ Uploaded: ${noteData.title}`);
        console.log(`   Status: ${response.data.note.status}`);
        console.log(`   Files: ${noteData.files.length}`);
        console.log('');
      } catch (uploadError) {
        console.error(`❌ Failed to upload: ${noteData.title}`);
        console.error('Error:', uploadError.response?.data?.message || uploadError.message);
      }
    }

    // Register admin user for testing
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Created admin user: admin@example.com / admin123');
    } catch (adminError) {
      console.log('Admin user already exists');
    }

    console.log('\n🎉 Test data upload completed!');
    console.log('\n📝 Login Credentials:');
    console.log('Student: teststudent@example.com / password123');
    console.log('Admin: admin@example.com / admin123');
    console.log('\n🌐 Visit: http://localhost:3000');

  } catch (error) {
    console.error('Error during upload process:', error.message);
  }
};

// Run the upload
uploadNotes();
