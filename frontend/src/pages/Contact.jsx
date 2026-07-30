import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { FaEnvelope, FaPhone, FaMapMarker, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { setAlert } from '../store/slices/uiSlice'

function Contact() {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      dispatch(setAlert({ 
        type: 'error', 
        message: 'Please fill in all fields' 
      }))
      return
    }

    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      dispatch(setAlert({ 
        type: 'success', 
        message: 'Message sent successfully! We\'ll get back to you soon.' 
      }))
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      dispatch(setAlert({ 
        type: 'error', 
        message: 'Failed to send message. Please try again.' 
      }))
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: <FaEnvelope />, label: 'Email', value: 'support@taskmanager.com' },
    { icon: <FaPhone />, label: 'Phone', value: '+92 (304)1327454' },
    { icon: <FaMapMarker />, label: 'Location', value: 'master fiaz Street hujra lalian,Chiniot , punjab' },
  ]

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Contact Us</h1>
        <p className="lead text-muted">
          Have questions or feedback? We'd love to hear from you!
        </p>
      </div>

      <Row className="g-4">
        <Col lg={5}>
          <div className="bg-white rounded-3 shadow-sm p-4 h-100">
            <h3 className="mb-4">Get in Touch</h3>
            
            {contactInfo.map((info, index) => (
              <div key={index} className="d-flex gap-3 mb-4">
                <div className="text-primary fs-4 mt-1">{info.icon}</div>
                <div>
                  <div className="fw-semibold">{info.label}</div>
                  <div className="text-muted">{info.value}</div>
                </div>
              </div>
            ))}

            <div>
              <h5 className="mb-3">Follow Us</h5>
              <div className="d-flex gap-3">
                <a href="#" className="text-secondary hover-primary transition">
                  <FaTwitter size={24} />
                </a>
                <a href="#" className="text-secondary hover-primary transition">
                  <FaGithub size={24} />
                </a>
                <a href="#" className="text-secondary hover-primary transition">
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={7}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg"
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Contact