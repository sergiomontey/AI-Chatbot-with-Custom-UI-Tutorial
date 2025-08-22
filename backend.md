# app.py — Annotated Walkthrough

> **Format:** Each code section is followed by a numbered **Annotations** list.  
> Click to expand a section.

---

<details>
<summary><strong>1) Imports & App Setup</strong></summary>

```python
from flask import Flask, request, jsonify     # [1]
from flask_cors import CORS                   # [2]
import google.generativeai as genai           # [3]
import os                                     # [4]

app = Flask(__name__) # [5]
CORS(app)             # [6]
```
**Annotations**
1. `Flask` to create the web server, `request` to read POST bodies, `jsonify` to return JSON.
2. Enables cross-origin calls from the frontend dev server (`localhost:5173`).
3. Official Gemini Python SDK.
4. Read environment variables (recommended for API keys).
5. Create a new Flask application.
6. Allow the browser app to call this API across ports.
</details>

---

<details>
<summary><strong>2) Configure Gemini</strong></summary>

```python
API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_API_KEY_HERE")  # [7]
genai.configure(api_key=API_KEY)                            # [8]

model = genai.GenerativeModel('gemini-2.5-flash-preview-05-20') # [9]
```
**Annotations**
7. Prefer environment variable; falls back to placeholder for local dev.
8. Initialize the SDK with your API key.
9. Choose a fast, chat-friendly Gemini model.
</details>

---

<details>
<summary><strong>3) Chat Endpoint</strong></summary>

```python
@app.route('/chat', methods=['POST'])  # [10]
def chat():
    if not request.json or 'message' not in request.json:  # [11]
        return jsonify({'error': 'Invalid request, "message" field is required.'}), 400

    user_message = request.json.get('message')             # [12]
    print(f"Received message: {user_message}")             # [13]

    try:
        response = model.generate_content(user_message)    # [14]

        if response.text:                                  # [15]
            chatbot_response = response.text
            print(f"Sending response: {chatbot_response}") # [16]
            return jsonify({'response': chatbot_response}) # [17]
        else:
            return jsonify({'response': 'Sorry, I could not generate a response.'}) # [18]

    except Exception as e:
        print(f"An error occurred: {e}")                   # [19]
        return jsonify({'error': 'An error occurred while processing the request.'}), 500
```
**Annotations**
10. Receives chat messages via POST.
11. Validates the payload and returns a clear 400 on malformed input.
12. Extract user’s text.
13. Server-side log for debugging.
14. Send content to Gemini and get a reply.
15. Guard: some SDK responses may lack `.text`.
16. Log the outgoing answer.
17. Return successful JSON payload.
18. Fallback response if the model produced no text.
19. Catch and log any errors; return 500 with a safe message.
</details>

---

<details>
<summary><strong>4) Run Server</strong></summary>

```python
if __name__ == '__main__':                     # [20]
    app.run(host='0.0.0.0', port=5001, debug=True)  # [21]
```
**Annotations**
20. Only run the dev server when executing this file directly.
21. Bind to all interfaces (useful in containers) and pick **5001**.
</details>

---


