from flask import Flask, jsonify, send_from_directory
import os
from dotenv import load_dotenv
load_dotenv()
from Facts_first_news import get_news_analysis

app = Flask(__name__, static_folder='frontend/build', static_url_path='')

@app.route('/api/news')
def api_news():
    """
    API endpoint to get the news analysis.
    """
    print("--- /api/news endpoint was hit ---")
    try:
        news_analysis = get_news_analysis()
        return jsonify(news_analysis)
    except Exception as e:
        import traceback
        print("--- ERROR in /api/news ---")
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