// /frontend/src/ArticleDetail.js

import React from 'react';
import { useParams } from 'react-router-dom';
import './ArticleDetail.css'; // Make sure the CSS is imported

const SentimentSection = ({ title, sentimentData }) => {
  if (!sentimentData || !sentimentData.summary) {
    return null;
  }

  return (
    <div className="sentiment-section">
      <h4>{title}</h4>
      <p className="sentiment-summary">{sentimentData.summary}</p>
      {sentimentData.examples && sentimentData.examples.length > 0 && (
        <ul>
          {sentimentData.examples.map((example, index) => <li key={index}><i>"{example}"</i></li>)}
        </ul>
      )}
    </div>
  );
};

const ArticleDetail = ({ stories, onBack }) => {
  const { index } = useParams();
  const story = stories[index];

  if (!story) {
    return <div>Story not found or is loading...</div>;
  }

  const {
    factual_headline = 'No Headline',
    core_facts = [],
    sentiments = {},
    source_articles = [],
  } = story;

  return (
    <div className="article-detail-container">
      <button onClick={onBack} className="back-button">
        &larr; Back
      </button>
      <h1 className="article-detail-headline">{factual_headline}</h1>

      <div className="detail-section">
        <h3>Core Facts</h3>
        {core_facts.length > 0 ? (
          <ul>
            {core_facts.map((fact, i) => <li key={i}>{fact}</li>)}
          </ul>
        ) : (
          <p>No core facts were extracted for this story.</p>
        )}
      </div>

      <div className="detail-section">
        <h3>Sentiment Analysis</h3>
        <SentimentSection title="For" sentimentData={sentiments.for} />
        <SentimentSection title="Against" sentimentData={sentiments.against} />
        <SentimentSection title="Neutral" sentimentData={sentiments.neutral} />
      </div>

      <div className="detail-section">
        <h3>Sources Analyzed ({source_articles.length})</h3>
        {source_articles.length > 0 ? (
          <ul>
            {source_articles.map((source, i) => (
              <li key={i}>
                <a href={source.link} className="source-link" target="_blank" rel="noopener noreferrer">
                  {source.title}
                </a>
                <br />
                <small>{source.source}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>Source information is not available.</p>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
