import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="text-center">
      <div className="jumbotron bg-light p-5 rounded">
        <h1 className="display-4">Welcome to EduSolGrow</h1>
        <p className="lead">
          A centralized educational platform for sharing and managing handwritten notes
        </p>
        <hr className="my-4" />
        <p>
          Upload your handwritten notes, browse through approved notes, and collaborate with fellow students.
        </p>
        
        <div className="mt-4">
          {!isAuthenticated ? (
            <div className="d-flex justify-content-center gap-3">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline-primary btn-lg">
                Login
              </Link>
            </div>
          ) : (
            <div className="d-flex justify-content-center gap-3">
              <Link to="/notes" className="btn btn-primary btn-lg">
                Browse Notes
              </Link>
              {!isAdmin && (
                <Link to="/upload" className="btn btn-success btn-lg">
                  Upload Notes
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="btn btn-warning btn-lg">
                  Admin Dashboard
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">📚 Upload Notes</h5>
              <p className="card-text">
                Share your handwritten notes in PDF or image format with the community.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">🔍 Browse & Search</h5>
              <p className="card-text">
                Find notes by subject, title, or description. Only approved notes are visible.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">✅ Quality Control</h5>
              <p className="card-text">
                All notes go through admin approval to ensure quality and relevance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
