# FactfirstAINews

A full-stack news analysis application that uses the Gemini API to provide unbiased, fact-based summaries of the latest
news.

## Features

* **AI-Powered Analysis:** Leverages the Gemini API to analyze news articles, extract core facts, and identify
  sentiment.
* **Fact-Based Summaries:** Generates a neutral, "factual headline" for a group of related articles.
* **Modern Frontend:** A responsive and stylish user interface built with React.
* **REST API Backend:** A Python Flask server that fetches and processes the news, serving it to the frontend.

## Tech Stack

* **Backend:** Python, Flask
* **Frontend:** React, JavaScript
* **API:** Google Gemini
* **Styling:** CSS, Material Design principles

## Getting Started

### Prerequisites

* Python 3.x
* Node.js and npm
* A Google Gemini API Key

### Backend Setup

1. **Navigate to the project root:**
   ```sh
   cd FactfirstAINews
   ```

2. **Install Python dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

3. **Run the Flask server:**
   ```sh
   python Facts_first_news.py
   ```
   The backend will be running at `http://127.0.0.1:5000`.

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```sh
   cd FactfirstAINews/frontend
   ```

2. **Install Node modules:**
   ```sh
   npm install
   ```

3. **Run the React development server:**
   ```sh
   npm start
   ```
   The frontend will open automatically in your browser at `http://localhost:3000`.
