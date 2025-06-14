// components/Chatbot/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  BsRobot,
  BsSend,
  BsX,
  BsHandThumbsUp,
  BsHandThumbsDown
} from 'react-icons/bs';
import '../../assests/css/Chatbot.css';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const formattedChat = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const currentChat = [...formattedChat, { role: 'user', parts: [{ text: userMsg.content }] }];
      const apiKey = "AIzaSyA4RnX10QWfsj-c0fzIu5Ttqo2zu5Lza-c"; 
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: currentChat })
        }
      );
       
      console.log("gemine api ", response)
      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm sorry, I couldn't generate a response at this moment.";

      setMessages(prev => [...prev, { role: 'bot', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', content: 'Gemini API error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="chat-toggle btn rounded-circle"
        onClick={() => setOpen(!open)}
      >
        {open ? <BsX size={20} /> : <BsRobot size={24} />}
      </button>

      {open && (
        <div className="chat-window shadow-lg">
          <div className="chat-header bg-purple text-white p-2 d-flex justify-content-between align-items-center">
            <div>
              <strong>AlFin</strong>
              <div className="small">24×7 Support Bot</div>
            </div>
            <BsX role="button" onClick={() => setOpen(false)} />
          </div>

          <div className="chat-body p-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div className={`chat-bubble ${msg.role === 'user' ? 'bg-user' : 'bg-bot'}`}>
                  {msg.content}
                  {msg.role === 'bot' && (
                    <div className="emoji-response mt-2">
                      <BsHandThumbsUp className="me-2 reaction-icon" />
                      <BsHandThumbsDown className="reaction-icon" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-footer p-2 border-top">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="btn btn-purple" onClick={handleSend} disabled={isLoading}>
                <BsSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
