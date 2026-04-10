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
  createdAt: string;
}

const Profile: React.FC = () => {
  const { user, token } = useAuth();
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debug: Log user data
  console.log('Profile - User data:', user);
  const [stats, setStats] = useState({
    totalNotes: 0,
    approvedNotes: 0,
    pendingNotes: 0,
    rejectedNotes: 0,
    totalFiles: 0
  });

  useEffect(() => {
    fetchUserNotes();
  }, []);

  const fetchUserNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notes/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const notes = response.data;
      setUserNotes(notes);
      
      // Calculate statistics
      const statistics = {
        totalNotes: notes.length,
        approvedNotes: notes.filter((n: Note) => n.status === 'approved').length,
        pendingNotes: notes.filter((n: Note) => n.status === 'pending').length,
        rejectedNotes: notes.filter((n: Note) => n.status === 'rejected').length,
        totalFiles: notes.reduce((acc: number, note: Note) => acc + note.files.length, 0)
      };
      
      setStats(statistics);
    } catch (err: any) {
      setError('Failed to fetch user notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (files: { fileUrl: string; fileName: string }[]) => {
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
      }, index * 500);
    });
  };

  const getStatusBadge = (status: string) => {
    const badgeClass = {
      pending: 'bg-warning',
      approved: 'bg-success',
      rejected: 'bg-danger'
    }[status] || 'bg-secondary';
    
    return <span className={`badge ${badgeClass}`}>{status.toUpperCase()}</span>;
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
      <h2 className="mb-4">My Profile</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* User Information */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">User Information</h5>
              <p className="card-text">
                <strong>Username:</strong> {user?.username || 'N/A'}<br />
                <strong>Email:</strong> {user?.email || 'N/A'}<br />
                <strong>Role:</strong> <span className="badge bg-info">{user?.role || 'N/A'}</span><br />
                <strong>Member Since:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Statistics</h5>
              <div className="row text-center">
                <div className="col-md-2">
                  <div className="stat-box">
                    <h4 className="text-primary">{stats.totalNotes}</h4>
                    <small>Total Notes</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="stat-box">
                    <h4 className="text-success">{stats.approvedNotes}</h4>
                    <small>Approved</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="stat-box">
                    <h4 className="text-warning">{stats.pendingNotes}</h4>
                    <small>Pending</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="stat-box">
                    <h4 className="text-danger">{stats.rejectedNotes}</h4>
                    <small>Rejected</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="stat-box">
                    <h4 className="text-info">{stats.totalFiles}</h4>
                    <small>Total Files</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Notes */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">My Uploaded Notes</h5>
        </div>
        <div className="card-body">
          {userNotes.length === 0 ? (
            <div className="text-center py-5">
              <h4>No notes uploaded yet</h4>
              <p>Start by uploading your first note!</p>
              <a href="/upload" className="btn btn-primary">Upload Notes</a>
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
                    <th>Status</th>
                    <th>Files</th>
                    <th>Upload Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userNotes.map(note => (
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
                      <td>{getStatusBadge(note.status)}</td>
                      <td>{note.files.length}</td>
                      <td>{new Date(note.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleDownload(note.files)}
                          title="Download"
                        >
                          Download ({note.files.length})
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
