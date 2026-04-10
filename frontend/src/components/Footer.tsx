import React from 'react';

const Footer: React.FC = () => {
  const linkStyle = {
    color: '#adb5bd',
    textDecoration: 'none',
    fontSize: '0.875rem'
  };

  const textStyle = {
    color: '#adb5bd',
    fontSize: '0.875rem'
  };

  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          {/* EduSolGrow Column */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="mb-3 fw-bold" style={{ color: '#fff' }}>EduSolGrow</h5>
            <p style={textStyle}>
              Your trusted platform for handwritten notes and academic resources.
            </p>
          </div>
          
          {/* Resources Column */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="mb-3 fw-bold" style={{ color: '#fff' }}>Resources</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/notes" style={linkStyle}>
                  Notes
                </a>
              </li>
              <li className="mb-2">
                <a href="/upload" style={linkStyle}>
                  Upload Notes
                </a>
              </li>
              <li className="mb-2">
                <a href="/profile" style={linkStyle}>
                  My Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="mb-3 fw-bold" style={{ color: '#fff' }}>Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/help" style={linkStyle}>
                  Help Center
                </a>
              </li>
              <li className="mb-2">
                <a href="/contact" style={linkStyle}>
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="/faq" style={linkStyle}>
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="mb-3 fw-bold" style={{ color: '#fff' }}>Connect</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="mailto:support@edusolgrow.com" style={linkStyle}>
                  Email
                </a>
              </li>
              <li className="mb-2">
                <a href="https://www.linkedin.com/feed/" style={linkStyle} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li className="mb-2">
                <a href="https://www.instagram.com" style={linkStyle} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <p style={textStyle}>
              &copy; {new Date().getFullYear()} EduSolGrow. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
