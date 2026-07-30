// src/components/Footer.jsx
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart } from 'react-icons/fa'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row className="align-items-center">
          {/* Left Side - Copyright */}
          <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0">
              &copy; {currentYear} Task Management System
            </p>
            <small className="text-muted">
              Built with <FaHeart className="text-danger mx-1" /> for productivity
            </small>
          </Col>

          {/* Center - Quick Links */}
          <Col md={4} className="text-center mb-3 mb-md-0">
            <div className="d-flex justify-content-center gap-3">
              <a href="#" className="text-white text-decoration-none hover-link">
                Home
              </a>
              <span className="text-muted">|</span>
              <a href="#" className="text-white text-decoration-none hover-link">
                About
              </a>
              <span className="text-muted">|</span>
              <a href="#" className="text-white text-decoration-none hover-link">
                Contact
              </a>
              <span className="text-muted">|</span>
              <a href="#" className="text-white text-decoration-none hover-link">
                Privacy
              </a>
            </div>
          </Col>

          {/* Right Side - Social Links */}
          <Col md={4} className="text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white social-icon"
                title="GitHub"
              >
                <FaGithub size={24} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white social-icon"
                title="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white social-icon"
                title="Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a 
                href="mailto:contact@example.com" 
                className="text-white social-icon"
                title="Email"
              >
                <FaEnvelope size={24} />
              </a>
            </div>
          </Col>
        </Row>

        {/* Bottom Line - Version Info */}
        <Row className="mt-3 pt-3 border-top border-secondary">
          <Col className="text-center">
            <small className="text-muted">
              Version 1.0.0 | Made with React, Redux & FastAPI
            </small>
          </Col>
        </Row>
      </Container>

      {/* ✅ Add CSS for hover effects */}
      <style jsx>{`
        .hover-link:hover {
          color: #0d6efd !important;
          transition: color 0.3s ease;
        }
        .social-icon {
          transition: all 0.3s ease;
          display: inline-block;
        }
        .social-icon:hover {
          color: #0d6efd !important;
          transform: translateY(-3px);
        }
      `}</style>
    </footer>
  )
}

export default Footer