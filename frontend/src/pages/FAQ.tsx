import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is EduSolGrow?",
      answer: "EduSolGrow is a comprehensive platform for sharing and accessing educational notes. We empower students and educators to collaborate, learn, and grow together in a vibrant academic community. Our platform allows users to upload, share, and access high-quality handwritten and typed notes across various subjects and courses."
    },
    {
      question: "How do I create an account?",
      answer: "Creating an account is simple! Click on the 'Register' button in the navigation bar, fill in your details including name, email, and password. After registration, you'll receive a confirmation email. Click the link in the email to verify your account and start using EduSolGrow immediately."
    },
    {
      question: "Is EduSolGrow free to use?",
      answer: "Yes! EduSolGrow is completely free for students and educators. You can browse notes, upload your own content, and participate in our community without any charges. We believe education should be accessible to everyone, which is why our core features are free."
    },
    {
      question: "What types of notes can I upload?",
      answer: "You can upload various types of educational materials including handwritten notes, typed documents, PDFs, presentations, and study guides. We support multiple file formats including PDF, JPEG, PNG, and more. All uploads are subject to our content guidelines and approval process to ensure quality."
    },
    {
      question: "How does the note approval process work?",
      answer: "When you upload notes, they go through a review process to ensure they meet our quality standards. Our admin team reviews submissions for accuracy, relevance, and appropriate content. Approved notes become publicly available, while rejected notes are removed with feedback provided to the uploader."
    },
    {
      question: "Can I edit or delete my uploaded notes?",
      answer: "Yes, you have full control over your uploaded content. You can edit or delete your notes at any time from your profile page. However, if your notes have already been approved and downloaded by other users, we recommend keeping them available to maintain the integrity of our community resources."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "If you encounter any inappropriate or copyrighted content, please report it immediately using the 'Report' button on the note page. You can also contact our support team at support@edusolgrow.com. We take all reports seriously and will investigate and take appropriate action promptly."
    },
    {
      question: "Can I download notes for offline use?",
      answer: "Yes, approved notes can be downloaded for offline study. Simply click the download button on any approved note page. Downloaded notes are for personal use only and should not be redistributed without proper attribution to the original uploader."
    },
    {
      question: "How do I become an admin or moderator?",
      answer: "Admin and moderator roles are typically assigned to trusted community members who demonstrate consistent quality contributions and helpful engagement. If you're interested in contributing to our community management, please contact our team with your experience and how you'd like to help."
    },
    {
      question: "What subjects and courses are covered?",
      answer: "EduSolGrow covers a wide range of subjects including Mathematics, Science, Engineering, Business, Arts, Humanities, and more. We support notes from various educational institutions and courses. You can browse notes by subject, course, or use our search feature to find specific topics."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team through multiple channels: email us at support@edusolgrow.com, call us at +1 (555) 123-4567 during business hours (Mon-Fri, 9AM-6PM EST), or use the contact form on our website. We typically respond within 24 hours."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely! We take data privacy and security very seriously. Your personal information is encrypted and stored securely. We never share your data with third parties without your explicit consent, and we comply with all relevant data protection regulations including GDPR."
    },
    {
      question: "Can I collaborate with other users?",
      answer: "Yes! EduSolGrow encourages collaboration. You can comment on notes, connect with other users, and participate in discussions. You can also form study groups and share resources within our community platform."
    },
    {
      question: "What if I can't find notes for my specific course?",
      answer: "If you can't find notes for your specific course, you can request them in our community forums or upload your own notes to help others. Our community is constantly growing, and new content is added regularly. You can also set up notifications for when notes in your subject area become available."
    },
    {
      question: "How do I reset my password?",
      answer: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password. If you don't receive the email, check your spam folder."
    }
  ];

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-dark">Frequently Asked Questions</h1>
        <p className="lead text-muted">
          Find answers to common questions about EduSolGrow. Can't find what you're looking for? 
          <a href="/contact" className="text-primary text-decoration-none"> Contact our support team.</a>
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search FAQ..."
                aria-label="Search FAQ"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="mb-4">
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-outline-primary btn-sm">General</button>
              <button className="btn btn-outline-primary btn-sm">Account</button>
              <button className="btn btn-outline-primary btn-sm">Notes</button>
              <button className="btn btn-outline-primary btn-sm">Upload</button>
              <button className="btn btn-outline-primary btn-sm">Privacy</button>
              <button className="btn btn-outline-primary btn-sm">Technical</button>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="accordion" id="faqAccordion">
            {faqs.map((faq, index) => (
              <div className="accordion-item border mb-3" key={index}>
                <h2 className="accordion-header" id={`heading${index}`}>
                  <button
                    className={`accordion-button ${activeIndex === index ? '' : 'collapsed'}`}
                    type="button"
                    onClick={() => toggleAnswer(index)}
                    aria-expanded={activeIndex === index}
                    aria-controls={`collapse${index}`}
                  >
                    <span className="fw-semibold">{faq.question}</span>
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  className={`accordion-collapse collapse ${activeIndex === index ? 'show' : ''}`}
                  aria-labelledby={`heading${index}`}
                >
                  <div className="accordion-body">
                    <p className="text-muted mb-0">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Still Need Help Section */}
          <div className="text-center mt-5">
            <div className="card border-0 bg-light">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Still Need Help?</h5>
                <p className="text-muted mb-3">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <a href="/contact" className="btn btn-primary">
                    <i className="bi bi-envelope me-2"></i>
                    Contact Support
                  </a>
                  <a href="/help" className="btn btn-outline-primary">
                    <i className="bi bi-book me-2"></i>
                    Help Center
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="row mt-5">
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-person-circle fs-1 text-primary mb-3"></i>
                  <h6 className="fw-bold">Account Help</h6>
                  <p className="text-muted small">Manage your profile, reset password, and account settings</p>
                  <a href="/profile" className="btn btn-sm btn-outline-primary">My Account</a>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-cloud-upload fs-1 text-primary mb-3"></i>
                  <h6 className="fw-bold">Upload Guide</h6>
                  <p className="text-muted small">Learn how to upload and share your notes effectively</p>
                  <a href="/upload" className="btn btn-sm btn-outline-primary">Upload Notes</a>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-shield-check fs-1 text-primary mb-3"></i>
                  <h6 className="fw-bold">Privacy & Safety</h6>
                  <p className="text-muted small">Understand our privacy policies and safety measures</p>
                  <a href="/privacy" className="btn btn-sm btn-outline-primary">Privacy Policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
