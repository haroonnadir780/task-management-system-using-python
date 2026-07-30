import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Container } from "react-bootstrap";

import { store } from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import TasksPage from "./pages/TasksPage";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />

          <Container className="flex-grow-1 py-4">
            <Routes>
              <Route path="/" element={<TasksPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Container>

          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;