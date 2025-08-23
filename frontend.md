# 📘 App.tsx — Full Walkthrough

---

### 📌 Imports

**How:** Import React itself and three special hooks.  
**Why:** Each hook serves a role:

1. **`useState`** → Manages data that changes over time (like chat messages).  
2. **`useEffect`** → Runs actions after render or when data changes (like auto-scrolling).  
3. **`useRef`** → Holds a reference to a DOM element (like the chat window bottom).  

```tsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
```

---

### 📌 Define Message Type

**How:** Create a TypeScript `interface` for messages.  
**Why:** This enforces structure and prevents errors.

1. **`text`** → The message content.  
2. **`sender`** → Identifies whether it’s the **user** or the **bot**.  

```tsx
interface Message {
  text: string;
  sender: 'user' | 'bot';
}
```

---

### 📌 Component Setup

**How:** Start the main React functional component.  
**Why:** This is the root container for all logic + UI.  

```tsx
const App: React.FC = () => {
```

---

### 📌 State Variables

**How:** Use React’s `useState` hook to manage app state.  
**Why:** React automatically re-renders when state changes.  

1. **`messages`** → Stores the conversation history.  
2. **`input`** → Tracks the current input text.  
3. **`isLoading`** → Tracks if the bot is generating a response.  

```tsx
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I am a simple chatbot. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
```

---

### 📌 useRef Hook

**How:** Create a `ref` for the chat end.  
**Why:** Lets us auto-scroll the chat window to the bottom whenever a new message arrives.  

```tsx
  const chatEndRef = useRef<HTMLDivElement>(null);
```

---

### 📌 useEffect (Auto-Scroll)

**How:** Run a side effect whenever `messages` changes.  
**Why:** Ensures the newest message is always visible without the user scrolling manually.  

```tsx
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
```

---

### 📌 handleSendMessage Function

**How:** Define what happens when the user clicks **Send** or presses **Enter**.  
**Why:** Centralizes the chat flow — sending user input, calling the backend, and updating state.  

Steps:  
1. **Prevent default form behavior** (page reload).  
2. **Ignore empty input** or requests if already loading.  
3. **Add user’s message** to `messages`.  
4. **Clear input** and set `isLoading` to true.  
5. **Send a POST request** to the Flask backend (`/chat`).  
6. **Handle success** → Append bot’s reply.  
7. **Handle error** → Append fallback error message.  
8. **Finally** → Reset `isLoading`.  

```tsx
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const botResponse: Message = { text: data.response, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Failed to fetch from backend:", error);
      const errorMessage: Message = { text: "Sorry, something went wrong. Please try again later.", sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
```

---

### 📌 JSX Return (UI Layout)

**How:** Render the chat UI structure.  
**Why:** Separates concerns: logic lives in hooks + functions, UI lives in JSX.  

1. **Header** → Title of the chatbot.  
2. **Message Area** → Loops over `messages` and renders chat bubbles.  
3. **Typing Indicator** → Shows animated dots when `isLoading`.  
4. **Input Form** → Handles user input and sending messages.  

```tsx
  return (
    <div className="chatbot-container">
      <header className="chatbot-header">
        <h1>Simple Chatbot</h1>
      </header>

      <div className="message-area">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-bubble">
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <form onSubmit={handleSendMessage} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          className="input-field"
        />
        <button type="submit" disabled={isLoading} className="send-button">
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};
```

---

### 📌 Export Component

**How:** Export `App`.  
**Why:** So it can be used in `index.tsx` as the root component.  

```tsx
export default App;
```
