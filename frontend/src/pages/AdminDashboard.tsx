import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    email: string;
  };
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: {
    username: string;
  };
}

const AdminDashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('pending'); // Default to pending
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
  }, [notes, searchTerm, selectedStatus, selectedSubject, selectedCourse, selectedSemester]);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      
      console.log('AdminDashboard - Fetching notes');
      console.log('- Token from localStorage:', token);
      console.log('- Token length:', token?.length);
      
      if (!token) {
        setError('Please login to access admin dashboard');
        setLoading(false);
        return;
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      console.log('- Request headers:', headers);
      
      const response = await axios.get('http://localhost:5000/api/notes/all', {
        headers
      });
      
      if (response.data && Array.isArray(response.data)) {
        setNotes(response.data);
        
        // Extract unique values
        const uniqueSubjects = Array.from(new Set(response.data.map((note: Note) => note.subject))) as string[];
        const uniqueCourses = Array.from(new Set(response.data.map((note: Note) => note.course))) as string[];
        const uniqueSemesters = Array.from(new Set(response.data.map((note: Note) => note.semester))) as string[];
        
        setSubjects(uniqueSubjects);
        setCourses(uniqueCourses);
        setSemesters(uniqueSemesters);
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      console.error('AdminDashboard - Error fetching notes:', err);
      if (err.response?.status === 401) {
        setError('Authentication expired. Please login again.');
      } else {
        setError('Failed to fetch notes');
      }
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

    if (selectedStatus) {
      filtered = filtered.filter(note => note.status === selectedStatus);
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

  const handleReview = async (noteId: string, status: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/notes/${noteId}/review`, 
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Refresh the notes list
      fetchNotes();
    } catch (err: any) {
      setError('Failed to update note status');
    }
  };

  const getStatusBadge = (status: string) => {
    const badgeClass = {
      pending: 'bg-warning',
      approved: 'bg-success',
      rejected: 'bg-danger'
    }[status] || 'bg-secondary';
    
    return <span className={`badge ${badgeClass}`}>{status.toUpperCase()}</span>;
  };

  const handleDownload = (files: { fileUrl: string; fileName: string }[]) => {
    files.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = `http://localhost:5000${file.fileUrl}`;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Notes</h5>
              <h3 className="text-primary">{notes.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Pending</h5>
              <h3 className="text-warning">{notes.filter(n => n.status === 'pending').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Approved</h5>
              <h3 className="text-success">{notes.filter(n => n.status === 'approved').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Rejected</h5>
              <h3 className="text-danger">{notes.filter(n => n.status === 'rejected').length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-3">
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
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
        <div className="col-md-1">
          <button
            className="btn btn-secondary w-100"
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('pending'); // Reset to default
              setSelectedSubject('');
              setSelectedCourse('');
              setSelectedSemester('');
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Notes Table */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-5">
          <h4>No notes found</h4>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Uploaded By</th>
                <th>Status</th>
                <th>Upload Date</th>
                <th>Files</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotes.map(note => (
                <tr key={note._id}>
                  <td>
                    <div>
                      <strong>{note.title}</strong>
                      <br />
                      <small className="text-muted">{note.description.substring(0, 50)}...</small>
                    </div>
                  </td>
                  <td>{note.subject}</td>
                  <td>{note.course}</td>
                  <td>{note.semester}</td>
                  <td>
                    <div>
                      {note.uploadedBy.username}
                      <br />
                      <small className="text-muted">{note.uploadedBy.email}</small>
                    </div>
                  </td>
                  <td>{getStatusBadge(note.status)}</td>
                  <td>{new Date(note.createdAt).toLocaleDateString()}</td>
                  <td>{note.files.length} file(s)</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleDownload(note.files)}
                        title="Download"
                      >
                        📥
                      </button>
                      {note.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleReview(note._id, 'approved')}
                            title="Approve"
                          >
                            ✓
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleReview(note._id, 'rejected')}
                            title="Reject"
                          >
                            ✗
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
