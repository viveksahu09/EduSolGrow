import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Navigation: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const [userStats, setUserStats] = useState({ totalUsers: 0, totalNotes: 0 });
  const [statsLoading, setStatsLoading] = useState(false);

  // Debug: Log user data
  console.log('Navigation - User data:', user);
  console.log('Navigation - Is admin:', isAdmin);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const fetchUserStats = async (manual = false) => {
    if (isAdmin) {
      const token = localStorage.getItem('token');
      try {
        setStatsLoading(true);
        if (!token) {
          console.log('No token found, skipping stats fetch');
          setUserStats({ totalUsers: 0, totalNotes: 0 });
          return;
        }
        
        console.log('Fetching user stats...' + (manual ? ' (manual)' : ''));
        console.log('Token length:', token.length);
        console.log('Token starts with:', token.substring(0, 20) + '...');
        console.log('Admin status:', isAdmin);
        console.log('User role:', user?.role);
        console.log('User data:', user);
        
        // Double-check if user is actually admin
        if (user?.role !== 'admin') {
          console.log('User is not actually admin, skipping stats fetch');
          setUserStats({ totalUsers: 0, totalNotes: 0 });
          return;
        }
        
        const usersResponse = await axios.get('http://localhost:5000/api/users/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('Users API response status:', usersResponse.status);
        console.log('Users response data:', usersResponse.data);
        console.log('Users array length:', usersResponse.data?.length || 0);
        
        if (Array.isArray(usersResponse.data)) {
          setUserStats({
            totalUsers: usersResponse.data.length,
            totalNotes: 0
          });
        } else {
          console.error('Users response is not an array:', usersResponse.data);
          setUserStats({ totalUsers: 0, totalNotes: 0 });
        }
      } catch (error: any) {
        console.error('Error fetching user stats:', error);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        console.error('Error message:', error.message);
        
        // If 401 error, try to re-authenticate or use fallback
        if (error.response?.status === 401) {
          console.log('401 Unauthorized - token may be expired or user not admin');
          
          // Try to get current user info to verify admin status
          try {
            const currentUserResponse = await axios.get('http://localhost:5000/api/auth/currentuser', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Current user response:', currentUserResponse.data);
            
            if (currentUserResponse.data?.role === 'admin') {
              console.log('User is confirmed admin, but API call failed');
              // Set a fallback value
              setUserStats({ totalUsers: 1, totalNotes: 0 }); // At least 1 admin
            } else {
              console.log('User is not admin according to API');
              setUserStats({ totalUsers: 0, totalNotes: 0 });
            }
          } catch (currentUserError) {
            console.log('Failed to verify current user:', currentUserError);
            setUserStats({ totalUsers: 0, totalNotes: 0 });
          }
        } else {
          // Set default values to prevent UI issues
          setUserStats({ totalUsers: 0, totalNotes: 0 });
        }
      } finally {
        setStatsLoading(false);
      }
    } else {
      console.log('Not admin, skipping stats fetch');
      setUserStats({ totalUsers: 0, totalNotes: 0 });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserStats();
    }
  }, [isAuthenticated, isAdmin]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <strong>EduSolGrow</strong>
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/notes">Notes</Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/upload">Upload Notes</Link>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Profile</Link>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/users">Users</Link>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Dashboard</Link>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li className="nav-item dropdown" ref={dropdownRef}>
                  <button 
                    className="nav-link dropdown-toggle" 
                    onClick={toggleDropdown}
                    style={{ background: 'none', border: 'none', color: 'white' }}
                  >
                    <i className="bi bi-person-circle"></i> {user?.username}
                  </button>
                  {dropdownOpen && (
                    <ul className="dropdown-menu show" style={{ position: 'absolute', right: '0', left: 'auto', minWidth: '200px' }}>
                      <li><span className="dropdown-item-text"><strong>{user?.username}</strong></span></li>
                      <li><span className="dropdown-item-text">Role: {user?.role || 'User'}</span></li>
                      <li><span className="dropdown-item-text">Email: {user?.email}</span></li>
                      {isAdmin && (
                        <>
                          <li><hr className="dropdown-divider" /></li>
                          <li><span className="dropdown-item-text">
                            Total Users: {statsLoading ? 'Loading...' : userStats.totalUsers}
                            {!statsLoading && (
                              <button 
                                className="btn btn-sm btn-outline-secondary ms-2" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fetchUserStats(true);
                                }}
                                title="Refresh user count"
                              >
                                <i className="bi bi-arrow-clockwise"></i>
                              </button>
                            )}
                          </span></li>
                          <li><span className="dropdown-item-text">Total Notes: {userStats.totalNotes}</span></li>
                        </>
                      )}
                      <li><hr className="dropdown-divider" /></li>
                      <li><Link className="dropdown-item" to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link></li>
                      <li><Link className="dropdown-item" to="/settings" onClick={() => setDropdownOpen(false)}>Settings</Link></li>
                      {isAdmin && <li><Link className="dropdown-item" to="/users" onClick={() => setDropdownOpen(false)}>User Management</Link></li>}
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                    </ul>
                  )}
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
