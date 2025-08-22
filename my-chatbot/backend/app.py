from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

# Create the Flask application instance
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) to allow requests from the React frontend
CORS(app)

# Configure the Gemini API with your API key
# Replace "YOUR_API_KEY_HERE" with your actual Gemini API key.
# It's recommended to use environment variables for this.
API_KEY = "YOUR_API_KEY_HERE"
genai.configure(api_key=API_KEY)

# Define the chat model to be used for the chatbot
model = genai.GenerativeModel('gemini-2.5-flash-preview-05-20')

@app.route('/chat', methods=['POST'])
def chat():
    """
    Handles incoming chat messages from the frontend.
    It takes the user's message, sends it to the Gemini model,
    and returns the model's response.
    """
    # Check if the request body contains JSON data
    if not request.json or 'message' not in request.json:
        # Return a 400 Bad Request error if the request is invalid
        return jsonify({'error': 'Invalid request, "message" field is required.'}), 400

    # Extract the user's message from the request JSON
    user_message = request.json.get('message')
    print(f"Received message: {user_message}")

    try:
        # Call the Gemini API to generate a response.
        # This sends a single message and gets a single response.
        response = model.generate_content(user_message)
        
        # Check if the response contains content
        if response.text:
            chatbot_response = response.text
            print(f"Sending response: {chatbot_response}")
            # Return the response as JSON
            return jsonify({'response': chatbot_response})
        else:
            # Handle cases where the model did not generate a text response
            return jsonify({'response': 'Sorry, I could not generate a response.'})

    except Exception as e:
        # Catch any errors that occur during the API call and return an error message
        print(f"An error occurred: {e}")
        return jsonify({'error': 'An error occurred while processing the request.'}), 500

# This is the entry point for the Flask application.
# The `if __name__ == '__main__':` block ensures the server runs only
# when the script is executed directly.
if __name__ == '__main__':
    # Run the app on host 0.0.0.0 to make it accessible from outside
    # the container/localhost network (if deployed) and on port 5000.
    app.run(host='0.0.0.0', port=5001, debug=True)
