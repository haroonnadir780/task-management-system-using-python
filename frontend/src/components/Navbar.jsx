import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap'
import { FaTasks, FaHome, FaInfoCircle, FaEnvelope } from 'react-icons/fa'

function Navbar() {
  return (
    <BSNavbar bg="white" expand="lg" className="shadow-sm border-bottom">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="text-primary fw-bold">
          <FaTasks className="me-2" />
          TaskManager
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-secondary hover-primary">
              <FaHome className="me-1" /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="text-secondary hover-primary">
              <FaInfoCircle className="me-1" /> About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="text-secondary hover-primary">
              <FaEnvelope className="me-1" /> Contact
            </Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  )
}

export default Navbar