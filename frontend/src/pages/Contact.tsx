import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setShowAlert(true);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Hide alert after 5 seconds
      setTimeout(() => setShowAlert(false), 5000);
    }, 1500);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-dark">Contact Us</h1>
        <p className="lead text-muted">
          We're here to help! Get in touch with our team for any questions or support.
        </p>
      </div>

      {showAlert && (
        <div className="alert alert-success mb-4" role="alert">
          <h4 className="alert-heading">Message Sent Successfully!</h4>
          <p>Thank you for contacting us. We'll get back to you within 24-48 hours.</p>
        </div>
      )}

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="row">
            {/* Contact Information */}
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">Get in Touch</h4>
                  
                  <div className="mb-4">
                    <h6 className="fw-bold text-primary">
                      <i className="bi bi-envelope me-2"></i>Email
                    </h6>
                    <p className="text-muted mb-0">support@edusolgrow.com</p>
                    <small className="text-muted">We respond within 24 hours</small>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-bold text-primary">
                      <i className="bi bi-telephone me-2"></i>Phone
                    </h6>
                    <p className="text-muted mb-0">+1 (555) 123-4567</p>
                    <small className="text-muted">Mon-Fri, 9AM-6PM EST</small>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-bold text-primary">
                      <i className="bi bi-geo-alt me-2"></i>Office
                    </h6>
                    <p className="text-muted mb-0">
                      123 Education Street<br />
                      Learning City, LC 12345<br />
                      United States
                    </p>
                  </div>

                  <div>
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="bi bi-share me-2"></i>Social Media
                    </h6>
                    <div className="d-flex gap-3">
                      <a 
                        href="https://www.linkedin.com/feed/" 
                        className="text-primary text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-linkedin fs-5"></i>
                      </a>
                      <a 
                        href="https://www.instagram.com" 
                        className="text-primary text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-instagram fs-5"></i>
                      </a>
                      <a 
                        href="https://www.twitter.com" 
                        className="text-primary text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-twitter fs-5"></i>
                      </a>
                      <a 
                        href="https://www.facebook.com" 
                        className="text-primary text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-facebook fs-5"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">Send us a Message</h4>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Your Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label">Subject *</label>
                      <select
                        className="form-select"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="account">Account Issues</option>
                        <option value="feedback">Feedback & Suggestions</option>
                        <option value="partnership">Partnership Opportunities</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="message" className="form-label">Message *</label>
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Link */}
          <div className="row mt-4">
            <div className="col text-center">
              <div className="card border-0 bg-light">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Have a Quick Question?</h5>
                  <p className="text-muted mb-3">
                    Check out our FAQ section for answers to commonly asked questions.
                  </p>
                  <a href="/faq" className="btn btn-outline-primary">
                    <i className="bi bi-question-circle me-2"></i>
                    View FAQ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
