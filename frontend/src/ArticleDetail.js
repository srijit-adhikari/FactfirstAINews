import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ArticleDetail.css';

// --- SVG ICONS ---
const Icons = {
    Facts: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
    Close: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Link: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
    Narrative: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
};

// --- REUSABLE COMPONENTS ---

const SentimentSection = ({ narrative }) => {
    const [isOpen, setIsOpen] = useState(true); // Default to open

    if (!narrative) return null;

    return (
        <div className="sentiment-section">
            <button onClick={() => setIsOpen(!isOpen)} className="sentiment-header">
                <span className="sentiment-header-title">
                    <span className="sentiment-icon"><Icons.Narrative /></span>
                    {narrative.narrative_frame}
                </span>
                <span className={`chevron-icon ${isOpen ? 'open' : ''}`}><Icons.ChevronDown /></span>
            </button>
            {isOpen && (
                <div className="sentiment-content">
                    <p className="sentiment-summary">{narrative.description}</p>
                    {narrative.sources && narrative.sources.length > 0 && (
                        <div className="sentiment-examples">
                            <div className="sentiment-example">
                                <p className="sentiment-example-source">Sources: {narrative.sources.join(', ')}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- MAIN DETAIL VIEW ---

const ArticleDetail = ({ stories }) => {
    const { index } = useParams();
    const navigate = useNavigate();
    const story = stories[index];

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) navigate('/');
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [navigate]);

    if (!story) {
        return (
            <div className="detail-view-overlay">
                <div className="detail-view-modal">Loading...</div>
            </div>
        );
    }

    const { 
        story_title, 
        consensus_facts = [], 
        narrative_analysis = [], 
        source_articles = [],
        region = 'Global',
        topicality = 'News'
    } = story;

    return (
        <div className="detail-view-overlay" onClick={() => navigate('/')}>
            <div className="detail-view-modal" onClick={(e) => e.stopPropagation()}>
                <div className="detail-view-header">
                    <div>
                        <h2 className="detail-view-headline">{story_title}</h2>
                        <p className="detail-view-meta">{topicality} | {region}</p>
                    </div>
                    <button onClick={() => navigate('/')} className="detail-view-close-btn" aria-label="Close">
                        <Icons.Close />
                    </button>
                </div>

                <div className="detail-view-content">
                    {/* Core Facts Section */}
                    <div className="core-facts-section">
                        <h3 className="core-facts-title"><Icons.Facts /> Core Facts</h3>
                        {consensus_facts.length > 0 ? (
                            <ul className="core-facts-list">
                                {consensus_facts.map((fact, i) => <li key={i}>{fact}</li>)}
                            </ul>
                        ) : <p>No consensus facts were identified.</p>}
                    </div>

                    {/* Narrative Analysis Section */}
                    <div>
                        <h3 className="section-title">Narrative & Framing Analysis</h3>
                        {narrative_analysis.length > 0 ? (
                            <div className="sentiment-section-container">
                                {narrative_analysis.map((narrative, i) => <SentimentSection key={i} narrative={narrative} />)}
                            </div>
                        ) : <p>No narrative analysis available for this story.</p>}
                    </div>

                    {/* Sources Section */}
                    <div>
                        <h3 className="section-title">Sources Analyzed ({source_articles.length})</h3>
                        {source_articles.length > 0 ? (
                            <div className="sources-list">
                                {source_articles.map((source, i) => (
                                    <a key={i} href={source.link} target="_blank" rel="noopener noreferrer" className="source-link">
                                        {source.source}
                                        <Icons.Link />
                                    </a>
                                ))
                               }
                            </div>
                        ) : <p>No sources were analyzed for this story.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
