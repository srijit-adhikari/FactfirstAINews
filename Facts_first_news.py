
import os
import re
import sys
import json
import feedparser
import google.generativeai as genai
from dotenv import load_dotenv
from rich.console import Console
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import DBSCAN

# --- Console ---
console = Console()

# --- Configuration ---
def configure_gemini():
    """
    Configures the Gemini API with the key from environment variables.
    This version includes a critical fix to explicitly set the API endpoint,
    making the application more robust against environment issues.
    """
    load_dotenv()
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        console.print("🔴 [bold red]ERROR: GOOGLE_API_KEY environment variable not set.[/bold red]")
        console.print("Please get your API key from https://aistudio.google.com/app/apikey and set it in a .env file.")
        sys.exit(1)

    # CRITICAL FIX: Explicitly set the client endpoint to avoid environment conflicts.
    client_options = {"api_endpoint": "generativelanguage.googleapis.com"}
    genai.configure(api_key=api_key, client_options=client_options)
    console.print("✅ Gemini library configured successfully.")

# --- RSS Feeds ---
RSS_FEEDS = [
    "http://rss.cnn.com/rss/cnn_topstories.rss",
    "https://moxie.foxnews.com/google-publisher/latest.xml",
    "https://feeds.npr.org/1014/rss.xml",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "http://feeds.bbci.co.uk/news/world/rss.xml",
]

# --- Text Processing ---
def clean_text(text):
    """Cleans text for TF-IDF vectorization."""
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return text

# --- News Fetching and Clustering ---
def get_news_clusters():
    """Fetches news and clusters it into stories."""
    articles = []
    for url in RSS_FEEDS:
        feed = feedparser.parse(url)
        for entry in feed.entries:
            articles.append({
                "title": entry.title,
                "summary": entry.get("summary", entry.get("description", "")),
                "link": entry.link,
                "source": feed.feed.title
            })

    if not articles:
        return []

    # Clean titles for clustering
    cleaned_titles = [clean_text(article["title"]) for article in articles]

    # Vectorize and cluster
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(cleaned_titles)
    # Adjusted eps for better clustering
    clustering = DBSCAN(eps=0.8, min_samples=2, metric="cosine").fit(tfidf_matrix)

    # Group articles by cluster
    clusters = {}
    for i, label in enumerate(clustering.labels_):
        if label != -1:  # Ignore noise points
            if label not in clusters:
                clusters[label] = []
            clusters[label].append(articles[i])
    
    return list(clusters.values())


# --- AI Analysis ---
def get_consolidated_analysis(story_cluster):
    """
    Sends a cluster of articles to the Gemini model for consolidated analysis.
    """
    # Prepare the content for the AI model
    prompt_content = '''
    You are an expert news analyst. I will provide you with a JSON object containing a list of articles about the same news story.
    Your task is to perform a comprehensive analysis and return a single, consolidated JSON object with the following structure.

    IMPORTANT: The output MUST be a single, valid, syntactically correct JSON object. Do not include any text, explanations, or markdown formatting (e.g., ```json) before or after the JSON object.

    PAY SPECIAL ATTENTION to the 'sentiments' object. It contains three nested objects: 'for', 'neutral', and 'against'. You MUST place a comma after the closing brace of the 'for' object and after the closing brace of the 'neutral' object.

    {
      "factual_headline": "A neutral, factual headline for the entire story.",
      "core_facts": [
        "A list of key, verifiable facts extracted from all articles."
      ],
      "emoji_thumbnail": "A single emoji that visually represents the story.",
      "sentiments": {
        "for": {
          "summary": "A summary of the 'for' or positive sentiment/framing, if present.",
          "examples": ["An example quote or headline from one of the articles."]
        },
        "neutral": {
          "summary": "A summary of the neutral framing, if present.",
          "examples": ["An example quote or headline."]
        },
        "against": {
          "summary": "A summary of the 'against' or negative sentiment/framing, if present.",
          "examples": ["An example quote or headline."]
        }
      },
      "source_articles": [
        {
          "title": "The original title of the article.",
          "link": "The URL of the article.",
          "source": "The name of the news source."
        }
      ]
    }
    Analyze the provided articles and generate the consolidated report.
    '''

    # Create the list of articles for the prompt
    articles_for_prompt = [
        {
            "title": article["title"],
            "summary": article["summary"],
            "source": article["source"]
        } for article in story_cluster
    ]

    # Create the model and generate content
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content([prompt_content, str(articles_for_prompt)])
    return response.text


# --- Main Function ---
def get_news_analysis():
    """
    The main function to be called by the Flask app.
    Fetches, clusters, and analyzes news, returning a list of JSON objects.
    """
    # --- Configuration ---
    configure_gemini()

    story_clusters = get_news_clusters()
    analyzed_stories = []
    for cluster in story_clusters:
        if len(cluster) > 1: # Only analyze clusters with more than one article
            analysis_text = get_consolidated_analysis(cluster)
            try:
                # Find the start and end of the JSON object to handle malformed responses
                start_index = analysis_text.find('{')
                end_index = analysis_text.rfind('}') + 1
                
                # Ensure both '{' and '}' were found and in the correct order
                if start_index != -1 and end_index > start_index:
                    json_string = analysis_text[start_index:end_index]
                    parsed_json = json.loads(json_string)
                    analyzed_stories.append(parsed_json)
                else:
                    console.print(f"⚠️ [bold yellow]Warning:[/bold yellow] No valid JSON object found in response:\n{analysis_text}")

            except json.JSONDecodeError as e:
                # Handle JSON parsing errors gracefully
                console.print(f"🔴 [bold red]ERROR:[/bold red] Failed to decode JSON. Error: {e}")
                console.print(f"Attempted to parse: {json_string}")

    return analyzed_stories
