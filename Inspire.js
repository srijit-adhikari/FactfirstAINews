import React, { useState, useEffect } from 'react';

// --- MOCK DATA ---
// This data simulates the output of the AI analysis pipeline described in the PRD.
const mockNewsData = [
    {
        id: 1,
        factual_headline: "Central Bank Increases Key Interest Rate by 0.25%",
        emoji_thumbnail: "🏦📈",
        category: "Trade",
        source_count: 12,
        region: "Americas",
        analysis: {
            core_facts: [
                "The Federal Reserve raised the benchmark interest rate by 25 basis points on October 10, 2025.",
                "This is the third rate hike this calendar year.",
                "The new target range for the federal funds rate is 5.50% to 5.75%.",
                "Fed Chair stated the decision aims to 'combat persistent inflationary pressures'.",
                "The vote from the committee was unanimous."
            ],
            sentiments: {
                negative: {
                    summary: "Outlets with a negative framing focus on the immediate economic risks, highlighting potential job losses, increased borrowing costs for consumers, and the growing threat of a recession.",
                    examples: [
                        { source: "Economic Sentinel", text: "Fed's 'reckless' hike pushes families closer to the brink, making mortgages and car loans unaffordable." },
                        { source: "The Daily Critic", text: "In a move that ignores market warnings, the Central Bank's decision is seen as a direct contributor to a looming economic downturn." }
                    ]
                },
                neutral: {
                    summary: "Neutral coverage reports the event in a procedural manner, focusing on the mechanics of the rate change and its intended purpose without speculating heavily on long-term outcomes.",
                    examples: [
                        { source: "Global Financial News", text: "The Federal Open Market Committee concluded its two-day meeting, resulting in a quarter-point increase to the federal funds rate." },
                        { source: "MarketWatch Report", text: "The 0.25% adjustment aligns with economists' predictions and reflects the bank's ongoing strategy to manage inflation." }
                    ]
                },
                positive: {
                    summary: "Positive framing emphasizes the long-term benefits of tackling inflation, portraying the decision as a necessary and responsible step toward sustainable economic stability and a stronger currency.",
                    examples: [
                        { source: "The Economic Optimist", text: "A bold step towards fiscal responsibility, the rate increase signals a serious commitment to securing long-term economic health." },
                        { source: "Prosperity Today", text: "By acting decisively now, the Central Bank is paving the way for a more stable and predictable financial future for all." }
                    ]
                }
            },
            sources: [
                { name: "Economic Sentinel", url: "#" },
                { name: "The Daily Critic", url: "#" },
                { name: "Global Financial News", url: "#" },
                { name: "MarketWatch Report", url: "#" },
                { name: "The Economic Optimist", url: "#" },
                { name: "Prosperity Today", url: "#" },
                { name: "Reuters", url: "#" },
                { name: "Associated Press", url: "#" },
                { name: "Bloomberg", url: "#" },
                { name: "The Wall Street Journal", url: "#" },
                { name: "Financial Times", url: "#" },
                { name: "CNBC", url: "#" },
            ]
        }
    },
    {
        id: 2,
        factual_headline: "Two Nations Sign Cross-Border Green Energy Pact",
        emoji_thumbnail: "🤝🌍",
        category: "Climate",
        source_count: 8,
        region: "Europe",
        analysis: {
            core_facts: [
                "A bilateral agreement was signed between France and Germany on October 9, 2025.",
                "The pact involves a joint investment of €15 billion in renewable energy infrastructure.",
                "It aims to create a shared power grid for solar and wind energy by 2035.",
                "The signing ceremony took place in Brussels.",
                "The agreement includes provisions for technology sharing and joint research."
            ],
            sentiments: {
                negative: {
                    summary: "Negative interpretations question the feasibility and economic impact of the agreement, raising concerns about energy independence and the high cost to taxpayers.",
                    examples: [
                        { source: "Nationalist Tribune", text: "The pact surrenders national energy control and funnels billions of taxpayer euros into unreliable green projects." },
                        { source: "Energy Sector Alert", text: "Experts warn the ambitious timeline is unrealistic and could lead to grid instability and higher energy prices for consumers." }
                    ]
                },
                neutral: {
                    summary: "Neutral reporting details the specifics of the pact, its stated goals, and the timeline for implementation without significant praise or criticism.",
                    examples: [
                        { source: "European Policy Review", text: "The agreement outlines a 10-year plan for joint energy projects between the two EU member states." },
                        { source: "Reuters", text: "France and Germany have formally committed to a shared renewable energy grid, a plan first proposed in 2023." }
                    ]
                },
                positive: {
                    summary: "Positive coverage celebrates the agreement as a landmark step in combating climate change and fostering international cooperation, highlighting innovation and environmental benefits.",
                    examples: [
                        { source: "Green Future Weekly", text: "A historic collaboration that sets a new global standard for climate action and sustainable energy policy." },
                        { source: "The Progressive Post", text: "This visionary pact will accelerate the transition to clean energy, creating thousands of green jobs and a healthier planet." }
                    ]
                },
            },
            sources: [
                { name: "Nationalist Tribune", url: "#" },
                { name: "Energy Sector Alert", url: "#" },
                { name: "European Policy Review", url: "#" },
                { name: "Reuters", url: "#" },
                { name: "Green Future Weekly", url: "#" },
                { name: "The Progressive Post", url: "#" },
                { name: "Le Monde", url: "#" },
                { name: "Der Spiegel", url: "#" }
            ]
        }
    },
    {
        id: 3,
        factual_headline: "Global Health Organization Releases Annual Malaria Report",
        emoji_thumbnail: "🦟📊",
        category: "Health",
        source_count: 15,
        region: "Africa",
        analysis: {
            core_facts: [
                "The WHO published its 2025 World Malaria Report on October 11, 2025.",
                "Global malaria cases decreased by 5% compared to the previous year.",
                "The report cites increased distribution of insecticide-treated nets as a key factor.",
                "Sub-Saharan Africa still accounts for 94% of global malaria cases.",
                "The report calls for $5.2 billion in additional funding for prevention programs."
            ],
            sentiments: {
                negative: {
                    summary: "Negative framing focuses on the persistent challenges and the vast number of people still affected, suggesting that progress is too slow and current efforts are insufficient.",
                    examples: [
                        { source: "Global Health Inquirer", text: "Despite minor gains, the malaria crisis continues to devastate the African continent, with millions still at risk." },
                        { source: "The Daily Skeptic", text: "The report's call for billions more in funding highlights the ongoing failure to eradicate a preventable disease." }
                    ]
                },
                neutral: {
                    summary: "Neutral reports present the key statistics and findings from the report factually, quoting directly from the publication and avoiding interpretation.",
                    examples: [
                        { source: "Associated Press", text: "The World Health Organization's latest data shows a 5% year-over-year reduction in malaria cases worldwide." },
                        { source: "Science Today", text: "The 2025 report attributes the decline in cases to specific public health interventions, including bed net distribution." }
                    ]
                },
                positive: {
                    summary: "Positive coverage celebrates the reduction in cases as a major public health victory, highlighting the success of current strategies and the lives saved.",
                    examples: [
                        { source: "The Good News Gazette", text: "A testament to global cooperation, prevention efforts have saved millions of lives, proving that progress is possible." },
                        { source: "Future of Medicine", text: "Breakthroughs in prevention are yielding significant results, offering a beacon of hope in the long fight against malaria." }
                    ]
                }
            },
            sources: [
                { name: "Global Health Inquirer", url: "#" },
                { name: "The Daily Skeptic", url: "#" },
                { name: "Associated Press", url: "#" },
                { name: "Science Today", url: "#" },
                { name: "The Good News Gazette", url: "#" },
                { name: "Future of Medicine", url: "#" },
                { name: "The Lancet", url: "#" },
                { name: "BBC News", url: "#" },
                { name: "NPR", url: "#" },
                { name: "The Guardian", url: "#" },
                { name: "Al Jazeera", url: "#" },
                { name: "Doctors Without Borders", url: "#" },
                { name: "Bill & Melinda Gates Foundation", url: "#" },
                { name: "UN News", url: "#" },
                { name: "WHO Official Site", url: "#" }
            ]
        }
    },
    {
        id: 4,
        factual_headline: "Tech Firm Unveils AI Chip for Autonomous Vehicles",
        emoji_thumbnail: "🤖🚗",
        category: "Technology",
        source_count: 11,
        region: "Asia",
        analysis: {
            core_facts: [
                "NexaTech announced its 'QuantumDrive' AI chip on October 10, 2025, in Tokyo.",
                "The chip is designed specifically for Level 4 and 5 autonomous driving.",
                "It reportedly processes sensor data 40% faster than previous models.",
                "Mass production is scheduled to begin in Q2 2026.",
                "NexaTech has partnered with three major automotive manufacturers."
            ],
            sentiments: {
                negative: {
                    summary: "Critical perspectives raise safety and privacy concerns, questioning the technology's readiness for public roads and the potential for data misuse.",
                    examples: [
                        { source: "Digital Watchdog", text: "NexaTech's new chip rushes a dangerous and unproven technology to market, ignoring critical safety and ethical questions." },
                        { source: "Tech Labor Weekly", text: "The push for autonomous vehicles threatens millions of jobs in the transportation sector, a consequence conveniently ignored in the announcement." }
                    ]
                },
                neutral: {
                    summary: "Neutral reports focus on the technical specifications of the chip, its performance metrics, and the company's business strategy.",
                    examples: [
                        { source: "Semiconductor Journal", text: "The QuantumDrive chip utilizes a 3-nanometer architecture and integrates dedicated processors for LiDAR and camera data fusion." },
                        { source: "Nikkei Asia", text: "NexaTech's entry into the automotive AI market positions it as a key competitor to existing industry leaders." }
                    ]
                },
                positive: {
                    summary: "Positive framing hails the chip as a revolutionary breakthrough that will dramatically improve road safety, efficiency, and accessibility.",
                    examples: [
                        { source: "Future Forward", text: "This groundbreaking technology is poised to eliminate human error from driving, saving countless lives and transforming transportation." },
                        { source: "Innovation Insider", text: "NexaTech's QuantumDrive chip represents a quantum leap for the automotive industry, accelerating the future of mobility." }
                    ]
                }
            },
            sources: [
                { name: "Digital Watchdog", url: "#" },
                { name: "Tech Labor Weekly", url: "#" },
                { name: "Semiconductor Journal", url: "#" },
                { name: "Nikkei Asia", url: "#" },
                { name: "Future Forward", url: "#" },
                { name: "Innovation Insider", url: "#" },
                { name: "TechCrunch", url: "#" },
                { name: "The Verge", url: "#" },
                { name: "Wired", url: "#" },
                { name: "Toyota Press", url: "#" },
                { name: "Sony Group", url: "#" }
            ]
        }
    },
    {
        id: 5,
        factual_headline: "Archaeological Dig in Middle East Uncovers Ancient City",
        emoji_thumbnail: "🏺🗺️",
        category: "History",
        source_count: 7,
        region: "Middle East",
        analysis: {
            core_facts: [
                "A previously unknown Bronze Age settlement was discovered near the Dead Sea.",
                "The discovery was announced by the University of Tel Aviv's archaeology department on October 8, 2025.",
                "Artifacts found include pottery, tools, and tablets with an unidentified script.",
                "Radiocarbon dating places the city's main period of occupation between 3300 and 3000 BCE.",
                "The site spans approximately 15 acres."
            ],
            sentiments: {
                 negative: {
                    summary: "Negative angles are less common for this topic but may focus on the potential for political disputes over the artifacts or criticism of excavation methods.",
                    examples: [
                        { source: "Cultural Heritage Monitor", text: "The discovery raises immediate questions about the preservation and ownership of the artifacts, which are located in a politically sensitive area." }
                    ]
                },
                neutral: {
                    summary: "Neutral reporting describes the discovery, its location, the types of artifacts found, and quotes from the lead archaeologists.",
                    examples: [
                        { source: "Archaeology Magazine", text: "A team from the University of Tel Aviv has unearthed a significant Bronze Age urban center." },
                        { source: "History Today", text: "The find includes inscribed tablets that researchers hope will shed light on the region's early history." }
                    ]
                },
                positive: {
                    summary: "Positive coverage emphasizes the immense historical and cultural significance of the find, celebrating it as a monumental discovery that could rewrite history.",
                    examples: [
                        { source: "The Daily Discovery", text: "A breathtaking discovery that opens a new window into the ancient world and could redefine our understanding of early civilization." },
                        { source: "Knowledge Hub", text: "This incredible find promises to unlock the secrets of a lost culture, offering invaluable insights into our shared human past." }
                    ]
                }
            },
             sources: [
                { name: "Cultural Heritage Monitor", url: "#" },
                { name: "Archaeology Magazine", url: "#" },
                { name: "History Today", url: "#" },
                { name: "The Daily Discovery", url: "#" },
                { name: "Knowledge Hub", url: "#" },
                { name: "National Geographic", url: "#" },
                { name: "The Jerusalem Post", url: "#" }
            ]
        }
    }
];

// --- SVG ICONS ---
const Icons = {
    Facts: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    Negative: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
    Neutral: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Positive: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
    Close: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Link: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
};


// --- COMPONENTS ---

const Header = ({ activeFilter, setActiveFilter }) => {
    const filters = ["Global", "Americas", "Europe", "Asia", "Africa", "Middle East"];
    return (
        <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between py-4">
                    <div className="text-center sm:text-left mb-4 sm:mb-0">
                        <h1 className="text-3xl font-bold text-gray-800">FactFirst<span className="text-blue-600">.</span>News</h1>
                        <p className="text-sm text-gray-500 mt-1">Distinguishing Facts from Framing</p>
                    </div>
                    <nav className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                                    activeFilter === filter
                                        ? "bg-blue-600 text-white shadow"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
};

const NewsCard = ({ article, onSelect }) => (
    <div
        onClick={() => onSelect(article)}
        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
    >
        <div className="p-5">
            <div className="flex items-start justify-between">
                <div className="flex-grow">
                    <div className="flex items-center mb-3">
                         <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">{article.category}</span>
                         <span className="text-xs font-semibold bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{article.region}</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                        {article.factual_headline}
                    </h2>
                </div>
                <div className="text-5xl ml-4 flex-shrink-0">{article.emoji_thumbnail}</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
                <span>
                    <strong className="text-gray-700">{article.source_count}</strong> sources analyzed
                </span>
                <span className="text-blue-500 font-semibold group-hover:underline">
                    View Analysis &rarr;
                </span>
            </div>
        </div>
    </div>
);

const SentimentSection = ({ title, data, color }) => {
    const [isOpen, setIsOpen] = useState(false);

    const colorClasses = {
        red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', iconBg: 'bg-red-100' },
        gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', iconBg: 'bg-gray-100' },
        green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', iconBg: 'bg-green-100' },
    };

    const classes = colorClasses[color];

    return (
        <div className={`rounded-lg border ${classes.border} overflow-hidden`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex justify-between items-center p-4 text-left font-semibold ${classes.bg} ${classes.text}`}
            >
                <div className="flex items-center">
                    <span className={`p-2 rounded-full mr-3 ${classes.iconBg}`}>
                        {color === 'red' && <Icons.Negative />}
                        {color === 'gray' && <Icons.Neutral />}
                        {color === 'green' && <Icons.Positive />}
                    </span>
                    {title} Framing
                </div>
                <span className={isOpen ? 'rotate-180' : ''}><Icons.ChevronDown /></span>
            </button>
            {isOpen && (
                <div className="p-4 bg-white">
                    <p className="italic text-gray-600 text-sm mb-4">{data.summary}</p>
                    <div className="space-y-3">
                        {data.examples.map((ex, index) => (
                            <div key={index} className="border-l-4 border-gray-200 pl-3">
                                <p className="text-sm text-gray-700">"{ex.text}"</p>
                                <p className="text-xs font-semibold text-gray-500 mt-1">- {ex.source}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const DetailView = ({ article, onClose }) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-30 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 p-5 z-10">
                    <div className="flex justify-between items-start">
                         <div className="pr-10">
                           <h2 className="text-2xl font-bold text-gray-800">{article.factual_headline}</h2>
                           <p className="text-sm text-gray-500 mt-1">{article.category} | {article.region}</p>
                         </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-800 transition-colors p-2 -mr-2 -mt-2"
                            aria-label="Close"
                        >
                           <Icons.Close />
                        </button>
                    </div>
                </div>

                <div className="p-5 space-y-6">
                    {/* Core Facts Section */}
                    <div className="bg-white p-5 rounded-lg border border-green-200 shadow-sm">
                        <div className="flex items-center text-lg font-bold text-green-700 mb-3">
                            <Icons.Facts />
                            <span>Core Facts (Verified Across Sources)</span>
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {article.analysis.core_facts.map((fact, index) => (
                                <li key={index}>{fact}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Opinion Analysis Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Opinion & Framing Analysis</h3>
                        <div className="space-y-3">
                           <SentimentSection title="Negative" data={article.analysis.sentiments.negative} color="red" />
                           <SentimentSection title="Neutral" data={article.analysis.sentiments.neutral} color="gray" />
                           <SentimentSection title="Positive" data={article.analysis.sentiments.positive} color="green" />
                        </div>
                    </div>

                    {/* Source Attribution Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Sources Analyzed ({article.source_count})</h3>
                        <div className="flex flex-wrap gap-2">
                            {article.analysis.sources.map((source) => (
                                <a
                                    key={source.name}
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-gray-300 hover:text-black transition-colors flex items-center"
                                >
                                    {source.name}
                                    <Icons.Link />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function App() {
    const [activeFilter, setActiveFilter] = useState("Global");
    const [selectedArticle, setSelectedArticle] = useState(null);

    const filteredArticles = mockNewsData.filter(
        article => activeFilter === "Global" || article.region === activeFilter
    );

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <Header activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map(article => (
                        <NewsCard key={article.id} article={article} onSelect={setSelectedArticle} />
                    ))}
                </div>
                {filteredArticles.length === 0 && (
                     <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No articles found for "{activeFilter}".</p>
                    </div>
                )}
            </main>
            {selectedArticle && <DetailView article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
        </div>
    );
}
