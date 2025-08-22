# App.tsx — Annotated Walkthrough

> **Format:** Each code section is followed by a numbered **Annotations** list.  
> Click to expand a section.

---

<details>
<summary><strong>1) Imports & Types</strong></summary>

```tsx
import React, { useState, useEffect, useRef } from 'react'; // [1]
import './App.css';                                         // [2]

interface Message { // [3]
  text: string;     // [4]
  sender: 'user' | 'bot'; // [5]
}
```
**Annotations**
1. Pulls React and three hooks: `useState` (state), `useEffect` (side effects), `useRef` (DOM refs).
2. Loads component styles for layout, color, spacing.
3. TypeScript interface describing a single chat entry.
4. The message text users/bot will see.
5. Restricts `sender` to exactly `'user'` or `'bot'` to catch mistakes at compile time.
</details>

---

<details>
<summary><strong>2) Component State & Refs</strong></summary>

```tsx
const App: React.FC = () => {            // [6]
  const [messages, setMessages] = useState<Message[]>([ // [7]
    { text: "Hello! I am a simple chatbot. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState<string>('');       // [8]
  const [isLoading, setIsLoading] = useState<boolean>(false); // [9]

  const chatEndRef = useRef<HTMLDivElement>(null);      // [10]
```
**Annotations**
6. Functional React component (typed) that renders the whole chat UI.
7. Array of messages. Initial state seeds a friendly bot greeting.
8. Two-way bound text from the input field.
9. Tracks “typing…” and disables inputs while waiting for a reply.
10. DOM anchor to scroll the window to the newest message.
</details>

---

<details>
<summary><strong>3) Auto-Scroll Effect</strong></summary>

```tsx
  useEffect(() => {                  // [11]
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' }); // [12]
    }
  }, [messages]);                    // [13]
```
**Annotations**
11. Runs after renders and whenever dependencies change.
12. Smoothly scrolls to the bottom sentinel so latest messages are visible.
13. Re-run this effect whenever the message list updates.
</details>

---

<details>
<summary><strong>4) Submit Handler</strong></summary>

```tsx
  const handleSendMessage = async (e: React.FormEvent) => { // [14]
    e.preventDefault();                                     // [15]
    if (input.trim() === '' || isLoading) return;           // [16]

    const userMessage: Message = { text: input, sender: 'user' }; // [17]
    setMessages(prev => [...prev, userMessage]);                   // [18]
    setInput('');                                                  // [19]
    setIsLoading(true);                                            // [20]

    try {
      const res = await fetch('http://127.0.0.1:5001/chat', {      // [21]
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),       // [22]
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);          // [23]

      const data = await res.json();                               // [24]
      setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]); // [25]
    } catch (err) {
      console.error('Backend error:', err);                        // [26]
      setMessages(prev => [...prev, {                              // [27]
        text: 'Sorry, something went wrong. Please try again later.',
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);                                         // [28]
    }
  };
```
**Annotations**
14. Handles form submission (click “Send” or press Enter).
15. Prevents page reload on submit.
16. Ignore empty input and avoid parallel requests during loading.
17. Structure a new user message.
18. Append immutably to trigger a React re-render.
19. Clear the text field for a fresh input.
20. Engage the “typing…” state (UI feedback + disable form).
21. POST to Flask API on port **5001**.
22. Send the user message payload as JSON.
23. Bubble HTTP errors into the catch block.
24. Parse JSON body from Flask.
25. Append the model’s text response as a bot message.
26. Log client-side for debugging.
27. Show a graceful error bubble to the user.
28. Always release the loading state.
</details>

---

<details>
<summary><strong>5) JSX Layout</strong></summary>

```tsx
  return (
    <div className="chatbot-container">           {/* [29] */}
      <header className="chatbot-header">         {/* [30] */}
        <h1>Simple Chatbot</h1>
      </header>

      <div className="message-area">              {/* [31] */}
        {messages.map((msg, i) => (               // [32]
          <div
            key={i}
            className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`} // [33]
          >
            <div className="message-bubble">      {/* [34] */}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {isLoading && (                           // [35]
          <div className="typing-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}

        <div ref={chatEndRef}></div>              {/* [36] */}
      </div>

      <form onSubmit={handleSendMessage} className="input-form"> {/* [37] */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}             // [38]
          placeholder="Type a message..."
          disabled={isLoading}
          className="input-field"
        />
        <button type="submit" disabled={isLoading} className="send-button">
          {isLoading ? 'Sending...' : 'Send'}                    {/* [39] */}
        </button>
      </form>
    </div>
  );
};
export default App;
```
**Annotations**
29. Main wrapper; styles come from `App.css`.
30. Simple title bar.
31. Scrollable message area.
32. Render each message as a bubble.
33. Conditional class toggles left/right bubble styles.
34. Bubble container for message text.
35. Render dots while waiting for the backend.
36. Invisible anchor to auto-scroll to bottom.
37. Form binds Enter to submit.
38. Two-way data binding on the input field.
39. Button label reflects loading state.
</details>

---

## Tips for GitHub Readability

- Use **collapsible** `<details>...</details>` blocks (as above) to chunk explanations.
- Use **numbered callouts** `[1]`, `[2]` in code + a list under the block.
- Keep **lines under ~100 chars** where possible to reduce horizontal scrolling.
- Prefer **small sections** (Imports, State, Effects, Handler, JSX) over one giant code fence.
