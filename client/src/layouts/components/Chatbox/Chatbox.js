import React, { useState } from 'react';
import axios from 'axios';
import './Chatbox.scss'; // File CSS sẽ được thêm bên dưới

const ChatbotComponent = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const [isVisible, setIsVisible] = useState(true); // Trạng thái hiển thị

    // Hàm xử lý gửi tin nhắn
    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        setMessages([...messages, { type: 'user', text: inputValue }]);
        axios
            .post('http://127.0.0.1:5000/chatbot', {
                question: inputValue,
            })
            .then((response) => {
                setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: response.data.response }]);
            })
            .catch((error) => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { type: 'bot', text: 'Có lỗi xảy ra khi kết nối tới server.' },
                ]);
            });

        setInputValue('');
    };

    // Hàm xử lý thu nhỏ
    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    if (!isVisible) return null; // Nếu không hiển thị, trả về null
    // Hàm xử lý đóng chatbot
    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null; // Nếu không hiển thị, trả về null

    return (
        <div className="chat-container" style={{ zIndex: 100 }}>
            <div className="chat-header">
                <h3>Chat</h3>
                <div className="chat-header-buttons">
                    <button className="chat-minimize-btn" onClick={toggleMinimize}>
                        {isMinimized ? '▲' : '▼'}
                    </button>
                    <button className="chat-close-btn" onClick={handleClose}>
                        ×
                    </button>
                </div>
            </div>
            {!isMinimized && (
                <>
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={message.type === 'bot' ? 'chat-bot-message' : 'chat-user-message'}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input-container">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button className="chat-send-button" onClick={handleSendMessage}>
                            Send
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatbotComponent;
