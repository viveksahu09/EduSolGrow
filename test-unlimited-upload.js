const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Create multiple test files to test unlimited upload
const createTestFiles = () => {
  const uploadsDir = path.join(__dirname, 'backend', 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Create 15 test files to test unlimited upload
  const files = [];
  for (let i = 1; i <= 15; i++) {
    const filename = `test-file-${i}.pdf`;
    const content = Buffer.from(`%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Test File ${i}) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000200 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n256\n%%EOF`, 'binary');
    
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, content);
    files.push({
      path: filePath,
      filename: filename,
      originalname: filename
    });
  }

  return files;
};

// Test unlimited upload
const testUnlimitedUpload = async () => {
  try {
    console.log('Testing unlimited file upload...');
    
    // Login as test student
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'teststudent@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('Logged in successfully');

    // Create 15 test files
    const testFiles = createTestFiles();
    console.log(`Created ${testFiles.length} test files`);

    // Upload all 15 files
    const formData = new FormData();
    testFiles.forEach(file => {
      formData.append('files', fs.createReadStream(file.path), file.originalname);
    });
    
    formData.append('title', 'Unlimited File Upload Test');
    formData.append('subject', 'Computer Science');
    formData.append('course', 'B.Tech');
    formData.append('semester', 'Test Semester');
    formData.append('description', 'Testing unlimited file upload capability with 15 files');

    const response = await axios.post('http://localhost:5000/api/notes/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('✅ Upload successful!');
    console.log(`Note ID: ${response.data.note.id}`);
    console.log(`Files uploaded: ${testFiles.length}`);
    console.log(`Status: ${response.data.note.status}`);
    
    console.log('\n🎉 Unlimited file upload test completed!');
    console.log('You can now see this note in the admin dashboard for review.');
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
};

testUnlimitedUpload();
