import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Chatbot = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history, isOpen]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!message.trim()) return;

        const currentMessage = message;
        const userMessage = { role: 'user', content: currentMessage };
        setHistory(prev => [...prev, userMessage]);
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: currentMessage,
                    history: history
                })
            });

            const data = await response.json();

            if (response.ok) {
                setHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
            } else {
                setHistory(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to my travel servers. Please try again later." }]);
            }
        } catch (err) {
            setHistory(prev => [...prev, { role: 'assistant', content: "Network error. Please check if your travel assistant is online." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = (text) => {
        setMessage(text);
        // We use a timeout to let state update before sending
        setTimeout(() => {
            const btn = document.getElementById('chat-submit-btn');
            btn?.click();
        }, 100);
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, fontFamily: 'var(--font-sans)' }}>
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
                    border: 'none',
                    boxShadow: '0 10px 40px rgba(184, 134, 11, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: isOpen ? 'rotate(180deg) scale(0.95)' : 'scale(1)',
                    color: 'white',
                    padding: 0
                }}
            >
                {isOpen ? '✕' : '✨'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="animate-fade-in-up"
                    style={{
                        position: 'absolute',
                        bottom: '90px',
                        right: '0',
                        width: '420px',
                        height: '650px',
                        maxHeight: '80vh',
                        backgroundColor: 'var(--white)',
                        borderRadius: '2rem',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid var(--cream-dark)',
                        animation: 'fadeInUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--brown) 0%, var(--brown-dark) 100%)',
                        padding: '1.25rem 1.75rem',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid var(--gold)',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{
                                width: '45px',
                                height: '45px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.75rem',
                                border: '1px solid rgba(184, 134, 11, 0.3)',
                                backdropFilter: 'blur(5px)'
                            }}>🤖</div>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--gold)', fontSize: '1.15rem', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>GlobeTrotter AI</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%' }}></div>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.8, color: 'var(--cream)', fontWeight: 500 }}>Always Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.5 }}>✕</button>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1.75rem',
                        background: 'linear-gradient(to bottom, var(--cream-light), #ffffff)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem',
                        scrollbarWidth: 'thin'
                    }}>
                        {history.length === 0 && (
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}>🌟</div>
                                <h4 style={{ color: 'var(--charcoal)', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>Bespoke Travels</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--warm-gray)', lineHeight: 1.6, padding: '0 1rem' }}>
                                    Welcome, <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{user?.name || 'Explorer'}</span>.
                                    I am your personal AI concierge. How shall we craft your next journey?
                                </p>

                                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button
                                        onClick={() => handleQuickAction("Plan a luxury beach day trip from Erode")}
                                        style={{ background: 'white', border: '1px solid var(--cream-dark)', padding: '0.85rem 1rem', borderRadius: '1rem', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}
                                        className="hover:border-gold hover:text-gold"
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>🏖️</span> Beach day trips from Erode
                                    </button>
                                    <button
                                        onClick={() => handleQuickAction("Suggest a weekend culture getaway")}
                                        style={{ background: 'white', border: '1px solid var(--cream-dark)', padding: '0.85rem 1rem', borderRadius: '1rem', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}
                                        className="hover:border-gold hover:text-gold"
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>🏛️</span> Weekend culture getaways
                                    </button>
                                </div>
                            </div>
                        )}

                        {history.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    maxWidth: '85%',
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    padding: '1rem 1.25rem',
                                    borderRadius: msg.role === 'user' ? '1.5rem 1.5rem 0.25rem 1.5rem' : '1.5rem 1.5rem 1.5rem 0.25rem',
                                    background: msg.role === 'user' ? 'linear-gradient(135deg, #E8E2D5 0%, #D4C5B0 100%)' : 'white',
                                    color: msg.role === 'user' ? 'var(--charcoal)' : 'var(--charcoal)',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6,
                                    border: msg.role === 'user' ? '2px solid var(--gold)' : '1px solid var(--cream-dark)',
                                    fontWeight: msg.role === 'user' ? '500' : 'normal'
                                }}
                                className="animate-fade-in"
                            >
                                <div className="markdown-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', background: 'white', padding: '1rem 1.25rem', borderRadius: '1.5rem 1.5rem 1.5rem 0.25rem', border: '1px solid var(--cream-dark)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--gold)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                                    <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--gold)', borderRadius: '50%', animation: 'pulse 1.5s infinite', animationDelay: '0.2s' }}></div>
                                    <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--gold)', borderRadius: '50%', animation: 'pulse 1.5s infinite', animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form
                        onSubmit={handleSendMessage}
                        style={{
                            padding: '1.25rem 1.75rem',
                            background: 'white',
                            borderTop: '1px solid var(--cream-dark)',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center'
                        }}
                    >
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ask about your next adventure..."
                            style={{
                                flex: 1,
                                padding: '1rem 1.5rem',
                                borderRadius: 'var(--radius-full)',
                                border: '1px solid var(--cream-dark)',
                                background: 'var(--cream-light)',
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'all 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--cream-dark)'}
                        />
                        <button
                            id="chat-submit-btn"
                            type="submit"
                            disabled={loading || !message.trim()}
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'var(--gold)',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.4rem',
                                transition: 'all 0.3s',
                                opacity: (loading || !message.trim()) ? 0.5 : 1,
                                boxShadow: '0 5px 15px rgba(184, 134, 11, 0.2)'
                            }}
                        >
                            ➡️
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
