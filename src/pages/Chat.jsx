import { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './chat.css';

export default function Chat() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi. I'm here if you want to unpack your day, vent about stress, or just talk through whatever is on your mind. How are you feeling right now?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [wellnessData, setWellnessData] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        // Fetch their most recent check-in so the AI understands their current context
        const fetchLatestCheckin = async () => {
            const { data } = await supabase
                .from('checkins')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) setWellnessData(data);
        };
        fetchLatestCheckin();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];

        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            // Prepare the chat history for OpenAI (we omit the first greeting)
            const chatHistory = newMessages.slice(1).map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Call the Secure Supabase Edge Function
            const { data, error } = await supabase.functions.invoke('chat', {
                body: {
                    messages: chatHistory,
                    wellnessData
                }
            });

            if (error) throw error;
            if (data.error) throw new Error(data.error);

            // Look for the safety crisis trigger keyword
            if (data.reply?.includes("CRISIS_ESCALATE")) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "It sounds like you are going through an incredibly difficult time right now, and I want to make sure you have the right support. Please consider calling the NS Mental Health Crisis Line at 1-888-429-8167 or visiting the Support tab in this app for immediate, confidential human help."
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "I'm not sure how to respond to that." }]);
            }

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg = error.message || "I'm having trouble connecting right now.";
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMsg}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="chat-container">

            {/* Header Info */}
            <div className="chat-header-info">
                <h2 className="section-head">Wellness Companion</h2>
                <p className="chat-disclaimer">
                    This is an AI supportive space, not a medical professional. If you are in crisis, please use the Support tab.
                </p>
            </div>

            {/* Message List */}
            <div className="messages-area">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message-bubble ${msg.role}`}>
                        {msg.role === 'assistant' && <div className="bot-avatar">🌿</div>}
                        <div className={`msg-content ${msg.role === 'assistant' ? 'bot-bubble' : 'user-bubble'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="message-bubble assistant">
                        <div className="bot-avatar">🌿</div>
                        <div className="msg-content bot-bubble" style={{ fontStyle: 'italic', color: 'var(--muted)' }}>typing...</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form className="chat-input-area" onSubmit={handleSend}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isTyping}
                />
                <button type="submit" className="chat-send-btn" disabled={!input.trim() || isTyping}>
                    ↑
                </button>
            </form>
        </div>
    );
}
