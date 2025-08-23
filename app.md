# 🐍 app.py — Full Walkthrough

---

### 📌 Imports

**How:** Import Flask, CORS, Gemini SDK, and `os`.  
**Why:** Each import has a clear job:

1. **`Flask`** → Creates the web server.  
2. **`request`** → Reads JSON sent by the frontend.  
3. **`jsonify`** → Sends JSON responses back to the frontend.  
4. **`CORS`** → Allows cross-origin requests from the React dev server.  
5. **`google.generativeai`** → Official Gemini SDK for generating responses.  
6. **`os`** → Reads environment variables (for API keys).  

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
```

---

### 📌 App Setup

**How:** Initialize Flask and enable CORS.  
**Why:** Your frontend runs on a different port (e.g., 5173), so the browser needs CORS permissions to call your API.

```python
app = Flask(__name__)
CORS(app)
```

---

### 📌 Configure Gemini

**How:** Load the API key and initialize the Gemini SDK + model.  
**Why:** Keeps secrets out of the codebase and selects a fast, chat-friendly model.

1. **Environment Variable** → Prefer `GEMINI_API_KEY` so you don't hardcode secrets.  
2. **`genai.configure(...)`** → Authenticates the SDK.  
3. **Model** → `gemini-2.5-flash-preview-05-20` is a fast general model for chat.  

```python
API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_API_KEY_HERE")
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel('gemini-2.5-flash-preview-05-20')
```

> 📝 **Tip:** On macOS/Linux: `export GEMINI_API_KEY="your_key"`  
> On Windows (PowerShell): `setx GEMINI_API_KEY "your_key"` then restart the terminal.

---

### 📌 Chat Route (`/chat`)

**How:** Accept a POST with `{ "message": "..." }`, call Gemini, return a JSON reply.  
**Why:** This is the backend “bridge” between your React UI and the LLM.

Steps:  
1. **Validate input** → Return `400` if `"message"` is missing.  
2. **Call Gemini** → `model.generate_content(user_message)`.  
3. **Return text** → Send `{ "response": "..." }` back to the frontend.  
4. **Handle empty responses** → Send a friendly fallback string.  
5. **Handle errors** → Log and return `500` with a safe error message.  

```python
@app.route('/chat', methods=['POST'])
def chat():
    if not request.json or 'message' not in request.json:
        return jsonify({'error': 'Invalid request, "message" field is required.'}), 400

    user_message = request.json.get('message')
    print(f"Received message: {user_message}")

    try:
        response = model.generate_content(user_message)

        if response.text:
            chatbot_response = response.text
            print(f"Sending response: {chatbot_response}")
            return jsonify({'response': chatbot_response})
        else:
            return jsonify({'response': 'Sorry, I could not generate a response.'})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': 'An error occurred while processing the request.'}), 500
```

---

### 📌 Run the Server

**How:** Start Flask on `0.0.0.0:5001` with debug mode on.  
**Why:**  
1. **`0.0.0.0`** → Accessible from other devices/containers.  
2. **`5001`** → Avoids colliding with common defaults like 5000.  
3. **`debug=True`** → Live reloads + useful error logs for development.  

```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
```

---

### 📌 Test from the Frontend

**How:** Your React app sends a POST to this endpoint:

```ts
await fetch('http://127.0.0.1:5001/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: input }),
});
```

**Why:** This keeps the API boundary clean — the browser UI never talks directly to Gemini; it only talks to your Flask backend.

---

### 📌 Common Issues & Fixes

1. **CORS error** → Ensure `CORS(app)` is enabled and the frontend URL is correct.  
2. **401 Unauthorized** → Check `GEMINI_API_KEY` is set and terminal restarted.  
3. **Fetch failed** → Confirm Flask is running on `5001` and the fetch URL matches.  
4. **No response text** → Some errors return no `.text`; handle with a friendly fallback.  
5. **Port already in use** → Change `port=5001` (and update the frontend URL).  

---

🎉 That’s it — your Flask backend is production-ready for a simple chatbot: validated input, clear errors, clean JSON contracts, and a proper separation between UI and AI.
