import React from 'react';
import { Link } from 'react-router-dom';
import './NewsCard.css';

const NewsCard = ({ story, index }) => {
    if (!story) {
        return null;
    }

    return (
        <Link to={`/story/${index}`} className="news-card-link">
            <div className="card news-card">
                <div className="card-body">
                    <div className="emoji-thumbnail">{story.emoji_thumbnail}</div>
                    <h5 className="card-title">{story.factual_headline}</h5>
                    <p className="card-text">
                        <small className="text-muted">
                            {story.source_articles.length} sources analyzed
                        </small>
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default NewsCard;
