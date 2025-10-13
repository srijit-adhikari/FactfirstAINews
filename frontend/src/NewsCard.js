import React from 'react';
import { Link } from 'react-router-dom';
import './NewsCard.css';

const NewsCard = ({ story, index }) => {
    if (!story) {
        return null;
    }

    // Placeholder data until backend provides it
    const category = "News";
    const region = "Global";
    const emoji_thumbnail = "📰";

    return (
        <Link to={`/story/${index}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="news-card">
                <div className="news-card-content">
                    <div className="news-card-header">
                        <div className="news-card-title-section">
                            <div className="news-card-tags">
                                <span className="news-card-tag tag-category">{category}</span>
                                <span className="news-card-tag tag-region">{region}</span>
                            </div>
                            <h2 className="news-card-headline">
                                {story.story_title}
                            </h2>
                        </div>
                        <div className="news-card-emoji">{emoji_thumbnail}</div>
                    </div>
                    <div className="news-card-footer">
                        <span>
                            <strong>{story.source_articles.length}</strong> sources analyzed
                        </span>
                        <span className="news-card-view-analysis">
                            View Analysis &rarr;
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default NewsCard;
