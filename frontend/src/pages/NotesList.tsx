import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Note {
  _id: string;
  title: string;
  subject: string;
  course: string;
  semester: string;
  description: string;
  files: {
    fileUrl: string;
    fileName: string;
  }[];
  status: string;
  uploadedBy: {
    username: string;
  };
  createdAt: string;
}

const NotesList: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, searchTerm, selectedSubject, selectedCourse, selectedSemester]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notes/approved');
      setNotes(response.data);
      
      // Extract unique values
      const uniqueSubjects = Array.from(new Set(response.data.map((note: Note) => note.subject))) as string[];
      const uniqueCourses = Array.from(new Set(response.data.map((note: Note) => note.course))) as string[];
      const uniqueSemesters = Array.from(new Set(response.data.map((note: Note) => note.semester))) as string[];
      
      setSubjects(uniqueSubjects);
      setCourses(uniqueCourses);
      setSemesters(uniqueSemesters);
    } catch (err: any) {
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
    let filtered = notes;

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.semester.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(note => note.subject === selectedSubject);
    }

    if (selectedCourse) {
      filtered = filtered.filter(note => note.course === selectedCourse);
    }

    if (selectedSemester) {
      filtered = filtered.filter(note => note.semester === selectedSemester);
    }

    setFilteredNotes(filtered);
  };

  const handleDownload = (files: { fileUrl: string; fileName: string }[]) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show alert and redirect to login
      if (window.confirm('Please login to download notes. Click OK to go to the login page.')) {
        window.location.href = '/login';
      }
      return;
    }

    files.forEach((file, index) => {
      setTimeout(() => {
        const fileUrl = `http://localhost:5000${file.fileUrl}`;
        
        // Check if it's a PDF or image that can be opened in new tab
        const isPdf = file.fileName.toLowerCase().endsWith('.pdf');
        const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].some(ext => 
          file.fileName.toLowerCase().endsWith(ext)
        );
        
        if (isPdf || isImage) {
          // Open in new tab for PDFs and images
          window.open(fileUrl, '_blank');
        } else {
          // Force download for other file types
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = file.fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }, index * 500); // 500ms delay between downloads
    });
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Available Notes</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, description, subject, course, or semester..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="">All Semesters</option>
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-secondary w-100"
            onClick={() => {
              setSearchTerm('');
              setSelectedSubject('');
              setSelectedCourse('');
              setSelectedSemester('');
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-5">
          <h4>No notes found</h4>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="row">
          {filteredNotes.map(note => (
            <div key={note._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{note.title}</h5>
                  <p className="card-text">
                    <small className="text-muted">
                      Subject: {note.subject}<br />
                      Course: {note.course}<br />
                      Semester: {note.semester}
                    </small>
                  </p>
                  <p className="card-text">{note.description}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Uploaded by: {note.uploadedBy.username}<br />
                      Date: {new Date(note.createdAt).toLocaleDateString()}<br />
                      Files: {note.files.length} file(s)
                    </small>
                  </p>
                </div>
                <div className="card-footer">
                  <button
                    className={`btn ${isAuthenticated ? 'btn-primary' : 'btn-outline-primary'} w-100`}
                    onClick={() => handleDownload(note.files)}
                    title={isAuthenticated ? 'Download files' : 'Login required to download'}
                  >
                    {isAuthenticated ? (
                      <>Download ({note.files.length} files)</>
                    ) : (
                      <>Login to Download ({note.files.length} files)</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
