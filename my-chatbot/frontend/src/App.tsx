import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Import the new custom CSS file

// Define the structure for a chat message
interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const App: React.FC = () => {
  // State to hold the list of all chat messages
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I am a simple chatbot. How can I help you today?", sender: 'bot' }
  ]);
  // State to hold the current text in the input field
  const [input, setInput] = useState<string>('');
  // State to track if a response is being generated
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // A ref to automatically scroll the chat window to the bottom
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the latest message whenever the messages state changes
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Function to handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) {
      return;
    }

    // Add the user's message to the chat
    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput(''); // Clear the input field

    setIsLoading(true); // Start loading state

    try {
      // Make a POST request to the Python backend
      const response = await fetch('http://127.0.0.1:5001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse: Message = { text: data.response, sender: 'bot' };

      // Add the bot's response to the chat
      setMessages(prevMessages => [...prevMessages, botResponse]);

    } catch (error) {
      console.error("Failed to fetch from backend:", error);
      const errorMessage: Message = { text: "Sorry, something went wrong. Please try again later.", sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat header */}
      <header className="chatbot-header">
        <h1>Simple Chatbot</h1>
      </header>

      {/* Message display area */}
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

      {/* Input form */}
      <form onSubmit={handleSendMessage} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          className="input-field"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="send-button"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default App;
