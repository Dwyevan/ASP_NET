import React, { useState, useRef, useEffect } from 'react';

const AIConsultantChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'ai',
            text: 'Xin chào! Tôi là AI Sommelier của Royal Wine Estate. Tôi có thể giúp bạn chọn rượu vang phù hợp với khẩu vị, ngân sách và dịp đặc biệt. Hãy hỏi tôi nhé! 🍷'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bodyRef = useRef(null);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const quickReplies = [
        'Rượu vang nào ngon nhất?',
        'Tư vấn rượu tầm 500K',
        'Rượu vang đỏ hay trắng?'
    ];

    const aiResponses = [
        'Với tầm giá đó, tôi đề xuất dòng vang Chile hoặc Argentina. Chúng có hương vị đậm đà, phù hợp với ẩm thực Việt Nam.',
        'Rượu vang đỏ phù hợp với thịt đỏ và phô mai, trong khi vang trắng hợp với hải sản và salad. Bạn thường dùng với món gì?',
        'Tôi khuyên bạn nên thử dòng Cabernet Sauvignon cho vang đỏ đậm đà, hoặc Chardonnay cho vang trắng tươi mát.',
        'Với dịp lãng mạn, một chai Champagne hoặc Prosecco sẽ là lựa chọn tuyệt vời. Bạn muốn xem các sản phẩm không?',
        'Rượu vang Pháp nổi tiếng với Bordeaux và Burgundy. Nếu bạn muốn thử phong cách mới, vang Ý với Barolo cũng rất đáng thưởng thức!',
    ];

    const handleSend = (text) => {
        const msgText = text || input.trim();
        if (!msgText) return;

        setMessages(prev => [...prev, { type: 'user', text: msgText }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            setMessages(prev => [...prev, { type: 'ai', text: randomResponse }]);
            setIsTyping(false);
        }, 1200 + Math.random() * 800);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="ai-chat-window">
                    {/* Header */}
                    <div className="ai-chat-header">
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                <i className="fa-solid fa-robot mr-2"></i> AI Sommelier
                            </div>
                            <div style={{ fontSize: '0.72rem', opacity: 0.8, marginTop: '2px' }}>
                                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#2ECC71', marginRight: '5px' }}></span>
                                Online - Sẵn sàng tư vấn
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.3rem', cursor: 'pointer', padding: '4px 8px', opacity: 0.8, transition: 'opacity 0.2s' }}
                            onMouseOver={e => e.target.style.opacity = 1}
                            onMouseOut={e => e.target.style.opacity = 0.8}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="ai-chat-body" ref={bodyRef}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-bubble chat-${msg.type}`}>
                                {msg.text}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="chat-bubble chat-ai" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '8px 0' }}>
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}

                        {/* Quick Replies */}
                        {messages.length <= 1 && !isTyping && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                                {quickReplies.map((reply, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(reply)}
                                        style={{
                                            background: '#fff',
                                            border: '1px solid var(--wine-gold-light)',
                                            borderRadius: '20px',
                                            padding: '6px 14px',
                                            fontSize: '0.78rem',
                                            color: 'var(--wine-burgundy)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            fontWeight: 500
                                        }}
                                        onMouseOver={e => { e.target.style.background = 'var(--wine-gold)'; e.target.style.color = '#fff'; e.target.style.borderColor = 'var(--wine-gold)'; }}
                                        onMouseOut={e => { e.target.style.background = '#fff'; e.target.style.color = 'var(--wine-burgundy)'; e.target.style.borderColor = 'var(--wine-gold-light)'; }}
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="ai-chat-footer">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Hỏi về rượu vang..."
                            style={{
                                flex: 1,
                                border: '1px solid var(--border-light)',
                                borderRadius: '24px',
                                padding: '10px 18px',
                                fontSize: '0.88rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                background: 'var(--surface-light)'
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--wine-gold)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                            style={{
                                width: '42px', height: '42px',
                                borderRadius: '50%',
                                border: 'none',
                                background: input.trim() ? 'linear-gradient(135deg, var(--wine-gold), #D4B85A)' : 'var(--border-light)',
                                color: input.trim() ? '#fff' : 'var(--text-muted)',
                                cursor: input.trim() ? 'pointer' : 'default',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                                flexShrink: 0
                            }}
                        >
                            <i className="fa-solid fa-paper-plane" style={{ fontSize: '0.9rem' }}></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button className="ai-chat-btn" onClick={() => setIsOpen(!isOpen)}>
                <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-comment-dots'}`} style={{ transition: 'transform 0.3s' }}></i>
            </button>
        </>
    );
};

export default AIConsultantChat;
