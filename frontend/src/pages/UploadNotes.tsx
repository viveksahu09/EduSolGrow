import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UploadNotes: React.FC = () => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length === 0) {
      setFiles([]);
      setError('');
      return;
    }

    // Check each file
    for (const file of selectedFiles) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError(`File "${file.name}" is not allowed. Only images (JPEG, PNG, GIF) and PDF files are allowed`);
        return;
      }
    }
    
    setFiles(selectedFiles);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (files.length === 0) {
      setError('Please select at least 1 file to upload');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('course', course);
    formData.append('semester', semester);
    formData.append('description', description);

    try {
      const response = await fetch('http://localhost:5000/api/notes/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Note uploaded successfully! It will be visible once approved by an admin.');
        // Reset form
        setTitle('');
        setSubject('');
        setCourse('');
        setSemester('');
        setDescription('');
        setFiles([]);
        
        // Reset file input
        const fileInput = document.getElementById('files') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-center">Upload Notes</h3>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="course" className="form-label">Course</label>
                <select
                  className="form-select"
                  id="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                >
                  <option value="">Select Course</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="B.Com">B.Com</option>
                  <option value="B.A">B.A</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="M.Com">M.Com</option>
                  <option value="M.A">M.A</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="semester" className="form-label">Semester/Year</label>
                <input
                  type="text"
                  className="form-control"
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g., 1st Semester, 2nd Year, Final Year"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a brief description of your notes..."
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="files" className="form-label">Upload Files</label>
                <input
                  type="file"
                  className="form-control"
                  id="files"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.gif,.pdf"
                  multiple
                  required
                />
                <div className="form-text">
                  Allowed formats: JPEG, PNG, GIF, PDF (Multiple files allowed)
                </div>
              </div>
              
              {files.length > 0 && (
                <div className="mb-3">
                  <div className="alert alert-info">
                    <strong>Selected files ({files.length}):</strong>
                    <ul className="mb-0 mt-2">
                      {files.map((file, index) => (
                        <li key={index}>
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Notes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNotes;
