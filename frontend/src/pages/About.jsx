import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { FaCheckCircle, FaRocket, FaShieldAlt, FaUsers } from 'react-icons/fa'

function About() {
  const features = [
    {
      icon: <FaRocket className="text-primary display-6" />,
      title: 'Fast & Efficient',
      description: 'Built with FastAPI and React, our application provides lightning-fast performance and smooth user experience.'
    },
    {
      icon: <FaShieldAlt className="text-success display-6" />,
      title: 'Secure',
      description: 'Your data is protected with industry-standard security practices.'
    },
    {
      icon: <FaCheckCircle className="text-purple display-6" />,
      title: 'Feature Rich',
      description: 'Create, update, delete, and filter tasks with ease. Track progress with status management and priority levels.'
    },
    {
      icon: <FaUsers className="text-warning display-6" />,
      title: 'User Friendly',
      description: 'Intuitive interface designed for productivity. Clean UI with responsive design for all devices.'
    }
  ]

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">About TaskManager</h1>
        <p className="lead text-muted">
          A modern task management solution built with cutting-edge technology
        </p>
      </div>

      <Row className="g-4">
        {features.map((feature, index) => (
          <Col md={6} key={index}>
            <Card className="h-100 shadow-sm hover-shadow transition">
              <Card.Body className="p-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="flex-shrink-0">{feature.icon}</div>
                  <div>
                    <Card.Title>{feature.title}</Card.Title>
                    <Card.Text className="text-muted">{feature.description}</Card.Text>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default About