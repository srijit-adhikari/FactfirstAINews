from flask import Flask, jsonify, send_from_directory, request
import os
from dotenv import load_dotenv
load_dotenv()
from Facts_first_news import get_news_analysis

app = Flask(__name__, static_folder='frontend/build', static_url_path='')

@app.route('/api/analysis')
def api_analysis():
    """
    API endpoint to get the news analysis for a specific topic.
    """
    print("--- /api/analysis endpoint was hit ---")
    # Get topic from query parameter, with a default
    topic = request.args.get('topic', 'world news') 
    print(f"--- Topic: {topic} ---")
    try:
        # Pass topic to the analysis function
        news_analysis = get_news_analysis(topic=topic)
        return jsonify(news_analysis)
    except Exception as e:
        import traceback
        print(f"--- ERROR in /api/analysis for topic: {topic} ---")
        traceback.print_exc()
        return jsonify({"error": "An internal server error occurred. See server logs for details."}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """
    Serve the static files from the React app.
    """
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)
