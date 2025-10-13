import os
import json
import re
from datetime import datetime, timedelta
import hdbscan
import numpy as np
import umap
from dotenv import load_dotenv
from newsapi import NewsApiClient
from sentence_transformers import SentenceTransformer
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure the generative AI model
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
generation_config = {
    "temperature": 0.5,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 8192,
}
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
]
model = genai.GenerativeModel(
    model_name="gemini-2.5-pro",
    generation_config=generation_config,
    safety_settings=safety_settings,
)
print("✅ Gemini library configured successfully.")


def get_news(topic, hours=24):
    """Fetches news articles from the last 24 hours on a given topic."""
    print(f"🔍 Fetching news for topic: {topic} from the last {hours} hours...")
    newsapi = NewsApiClient(api_key=os.getenv("NEWS_API_KEY"))
    to_date = datetime.now()
    from_date = to_date - timedelta(hours=hours)

    try:
        all_articles = newsapi.get_everything(
            q=topic,
            from_param=from_date.strftime("%Y-%m-%dT%H:%M:%S"),
            to=to_date.strftime("%Y-%m-%dT%H:%M:%S"),
            language="en",
            sort_by="relevancy",
            page_size=100,
        )
        print(f"✅ Found {len(all_articles['articles'])} articles from the News API.")
        return all_articles["articles"]
    except Exception as e:
        print(f"❌ Error fetching news: {e}")
        return []


def get_news_clusters(articles):
    """Clusters news articles based on their content."""
    if not articles:
        return []

    print("🧠 Loading sentence transformer model ('all-MiniLM-L6-v2')...")
    model_st = SentenceTransformer("all-MiniLM-L6-v2")

    # Filter out articles with no content
    articles = [article for article in articles if article.get("title") and article.get("content")]

    print(f"⚡ Generating embeddings for {len(articles)} articles...")
    # Use only title and first two paragraphs for embeddings
    texts_to_embed = []
    for article in articles:
        title = article.get("title", "")
        body = article.get("content", "")
        paragraphs = [p.strip() for p in body.split('\n') if p.strip()]
        lede = " ".join(paragraphs[:2])
        texts_to_embed.append(title + " " + lede)

    embeddings = model_st.encode(texts_to_embed, show_progress_bar=True)

    print("📉 Reducing embedding dimensionality with UMAP...")
    reducer = umap.UMAP(n_components=20, n_neighbors=5, metric="cosine", random_state=42)
    reduced_embeddings = reducer.fit_transform(embeddings)

    print("🤖 Clustering articles with HDBSCAN...")
    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=3,
        min_samples=3,
        cluster_selection_method="leaf"
    )
    labels = clusterer.fit_predict(reduced_embeddings)

    # Group articles by cluster label
    clusters = {}
    for i, article in enumerate(articles):
        label = labels[i]
        if label != -1:  # -1 is for noise
            if label not in clusters:
                clusters[label] = []
            clusters[label].append(article)

    print(f"✅ Clustering complete. Found {len(clusters)} stories from {len(articles)} articles.")
    return list(clusters.values())


def analyze_cluster(cluster):
    """Analyzes a cluster of articles to find consensus, disputes, and narratives."""
    if not cluster:
        return None

    # Prepare the prompt for the generative model
    prompt_parts = [
        "Analyze the following news articles to identify the core news story. Based on all the articles provided, generate a comprehensive analysis in JSON format.",
        "\n--- Start of Articles ---\n",
    ]
    for article in cluster:
        prompt_parts.append(f"Source: {article['source']['name']}\n")
        prompt_parts.append(f"Title: {article['title']}\n")
        prompt_parts.append(f"Link: {article['url']}\n\n")
    prompt_parts.append("--- End of Articles ---\n")
    prompt_parts.append(
        '''
Here is an example of the desired JSON structure. Ensure your output matches this format exactly. The 'narrative_analysis' array is mandatory and must be populated.

```json
{
  "story_title": "Example Story Title",
  "timeline_of_events": [
    {
      "date": "YYYY-MM-DD",
      "event": "Description of a key event."
    }
  ],
  "consensus_facts": [
    "A verifiable fact agreed upon by multiple sources (Source: Name)",
    "Another verifiable fact (Source: Name)"
  ],
  "disputed_claims": [
    {
      "claim": "A claim that is disputed.",
      "sources_in_disagreement": [
        {"source": "Source A", "stance": "Their position on the claim."},
        {"source": "Source B", "stance": "Their different position."}
      ]
    }
  ],
  "analysis_of_omissions": [
    {
      "omission": "What key information is missing.",
      "impact": "The effect of this omission on the reader\'s understanding."
    }
  ],
  "narrative_analysis": [
    {
      "narrative_frame": "The name of the narrative frame (e.g., 'David vs. Goliath').",
      "description": "A description of how the sources use this frame to tell the story.",
      "sources": ["Source A", "Source C"]
    }
  ],
  "region": "Primary geographical region of the story",
  "topicality": "Primary topic (e.g., 'Politics')"
}
```

Provide the analysis in a single, well-formatted JSON object, enclosed in ```json and ```.
'''
    )

    response = None  # Define response here to make it available in the except block
    try:
        response = model.generate_content(prompt_parts)

        # Explicitly check if the response was blocked
        if not response.parts:
            raise ValueError(
                f"Response was blocked. Finish reason: {response.candidates[0].finish_reason}. Prompt feedback: {response.prompt_feedback}"
            )

        # Use regex to find the JSON block
        json_match = re.search(r"```json(.*)```", response.text, re.DOTALL)
        if not json_match:
            raise ValueError("Could not find a JSON block in the response.")

        json_str = json_match.group(1).strip()
        analysis = json.loads(json_str)

        analysis["source_articles"] = [
            {"source": a["source"]["name"], "title": a["title"], "link": a["url"]}
            for a in cluster
        ]
        return analysis
    except (json.JSONDecodeError, ValueError, Exception) as e:
        print(f"❌ Error analyzing cluster: {e}")
        if response:
            print(f"Prompt feedback: {response.prompt_feedback}")
            # print(f"Raw response was: {response.text}") # Be careful printing raw response
        else:
            print("No response object was created.")
        return None


def get_news_analysis(topic):
    """Main function to run the news analysis."""
    articles = get_news(topic)

    if not articles:
        return []

    clusters = get_news_clusters(articles)

    if not clusters:
        print("No significant story clusters found.")
        return []

    all_analyses = []
    for i, cluster in enumerate(clusters):
        print(f"🕵️ Analyzing story {i+1}/{len(clusters)}...")
        analysis = analyze_cluster(cluster)
        if analysis:
            all_analyses.append(analysis)

    # Keywords to identify summaries of unrelated articles
    unrelated_keywords = [
        'unrelated', 'no core story', 'no common story', 'disparate',
        'no single core', 'analysis impossible', 'assorted',
        'lack of a unifying', 'do not cover the same event', 'no single core story'
    ]

    coherent_stories = []
    for analysis in all_analyses:
        # Use the same robust check across multiple fields
        analysis_text = json.dumps(analysis).lower()
        is_unrelated = any(keyword in analysis_text for keyword in unrelated_keywords)

        if not is_unrelated:
            coherent_stories.append(analysis)
    
    print(f"✅ Analysis complete. Found {len(coherent_stories)} coherent stories.")
    return coherent_stories
