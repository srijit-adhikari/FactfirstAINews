# FactFirst AI News

FactFirst AI News is a full-stack news analysis application that uses a sophisticated AI pipeline to cut through the noise and deliver unbiased, fact-based summaries of the world'''s latest news stories.

## Project Overview

This project goes beyond simple news aggregation. It fetches articles from a wide variety of global sources via the NewsAPI, then uses a powerful machine learning pipeline to identify and group articles that are covering the same core event.

The pipeline works as follows:
1.  **Article Fetching:** Gathers the latest news from dozens of sources.
2.  **Sentence Transformers:** Generates high-dimensional vector embeddings for each article'''s title and description, capturing its semantic meaning.
3.  **HDBSCAN Clustering:** Uses the HDBSCAN algorithm to cluster the article embeddings, grouping related stories together with high accuracy.
4.  **AI-Powered Analysis:** For each coherent cluster of articles, the application uses the Google Gemini API to perform a deep analysis, generating:
    *   A neutral, fact-based **story title**.
    *   A list of **consensus facts** agreed upon by the sources.
    *   An analysis of **disputed claims** between sources.
    *   An examination of significant **omissions** in the reporting.
    *   A chronological **timeline of events**.
    *   A **narrative and framing analysis** that identifies the different ways the story is being told (e.g., "Political Blame Game," "Humanitarian Crisis").

The result is a clean, insightful, and unbiased view of the news, allowing users to understand not just *what* is happening, but *how* it'''s being reported.

## Features

*   **Advanced AI Pipeline:** Uses sentence transformers, HDBSCAN, and the Gemini API for deep analysis.
*   **Clustered Story Cards:** Groups related articles into coherent story cards.
*   **In-Depth Analysis:** Provides consensus facts, disputed claims, narrative framing, and more for each story.
*   **Modern Frontend:** A responsive and stylish user interface built with React.
*   **REST API Backend:** A Python Flask server that fetches and processes the news, serving it to the frontend.

## How to Set Up and Run the Project

Follow these instructions to get the project running on your local machine for development and testing purposes.

### Prerequisites

*   Python 3.8+
*   Node.js 14.0+ and npm

### Backend Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/FactfirstAINews.git
    cd FactfirstAINews
    ```

2.  **Create and activate a virtual environment:**
    ```sh
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Python dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

4.  **Create an environment file:**
    Create a file named `.env` in the root of the project directory and add your API keys:
    ```
    NEWS_API_KEY="your_news_api_key"
    GEMINI_API_KEY="your_gemini_api_key"
    ```

5.  **Run the Flask server:**
    ```sh
    flask run
    ```
    The backend will be running at `http://127.0.0.1:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

2.  **Install npm dependencies:**
    ```sh
    npm install
    ```

3.  **Run the React development server:**
    ```sh
    npm start
    ```
    The frontend will open automatically in your browser at `http://localhost:3000`.

## Contributing

Contributions are welcome! If you have ideas for new features or have found a bug, please open an issue on the GitHub repository.
