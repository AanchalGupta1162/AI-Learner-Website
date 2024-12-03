from flask import Flask, request, Response
from youtube_transcript_api import YouTubeTranscriptApi
from flask_cors import CORS  # Import CORS

app = Flask(__name__)  # Instantiate Flask app
CORS(app)  # Enable CORS for the app

@app.route('/receive_url', methods=['GET'])
def receive_url():
    # Get the URL from the query parameters
    url = request.args.get('url', '')

    if not url:
        return Response("No URL provided", mimetype="text/plain", status=400)

    try:
        # Extract video ID from the YouTube URL
        video_id = url.split('v=')[1].split('&')[0]

        # Fetch the transcript using the video ID
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = ' '.join([d['text'] for d in transcript_list])

        # Return the transcript as plain text
        return Response(transcript, mimetype="text/plain")

    except Exception as e:
        # Handle errors (return the error as plain text)
        return Response(str(e), mimetype="text/plain", status=500)

if __name__ == "__main__":
    app.run(debug=True)
