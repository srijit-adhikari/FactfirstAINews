import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import NewsCard from './NewsCard';
import ArticleDetail from './ArticleDetail';
import './App.css';

// This component contains the main application logic and can use router hooks
const AppContent = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetch('/api/analysis')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
            throw new Error("Received unexpected data format from server");
        }
        setStories(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching news:", error);
        setError(error.toString());
        setLoading(false);
      });
  }, []);

  // Function to handle navigating back to the main page
  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="loading-container"><h1>Loading News Analysis...</h1></div>;
  }

  if (error) {
    return <div className="error-container"><h1>Error</h1><p>{error}</p></div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>Facts First AI News</h1>
          <p>Your daily briefing, stripped of bias and clustered by story.</p>
        </Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={
            <div className="news-grid">
              {stories.map((story, index) => (
                <NewsCard story={story} index={index} key={index} />
              ))}
            </div>
          } />
          {/* Pass the handleBack function to the ArticleDetail component */}
          <Route path="/story/:index" element={<ArticleDetail stories={stories} onBack={handleBack} />} />
        </Routes>
      </main>
    </div>
  );
};

// The top-level App component only sets up the Router
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
