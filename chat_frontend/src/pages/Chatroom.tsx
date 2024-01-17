import React, { useState, useEffect } from 'react';
import Logout from '../components/Logout';

type Message = {
    id: number;
    user: string;
    content: string;
    created_at: string;
    votes: number;
};

interface User {
    username: string;
}

interface ChatroomProps {
    checkAuthentication: () => Promise<void>;
}

const Chatroom: React.FC<ChatroomProps> = ({ checkAuthentication }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        fetchMessages();
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch('http://localhost:8000/v1/chatapp/current_user', {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Error fetching current user');
            const userData = await response.json();
            setCurrentUser(userData);
        } catch (error) {
            console.error('Fetch current user error:', error);
        }
    };

    const handleLogoutSuccess = async () => {
        await checkAuthentication();
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:8000/v1/chatapp/show_message', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Error fetching messages');
            const data = await response.json();
            setMessages(data.messages);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const handleSendMessage = async () => {
        try {
            const formData = new FormData();
            formData.append('content', newMessage);
            formData.append('timestamp', new Date().toISOString());

            const response = await fetch('http://localhost:8000/v1/chatapp/save_message', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) throw new Error('Error sending message');
            setNewMessage('');
            await fetchMessages();
        } catch (error) {
            console.error('Send message error:', error);
        }
    };

    const handleVote = async (messageId: number, voteType: string) => {
        try {
            const formData = new FormData();
            formData.append('message_id', messageId.toString());
            formData.append('vote_type', voteType.toString());

            const response = await fetch('http://localhost:8000/v1/chatapp/vote', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) throw new Error('Error voting');
            await fetchMessages();
        } catch (error) {
            console.error('Vote error:', error);
        }
    };

    return (
        <div className="chatroom-container">
            <Logout onLogoutSuccess={handleLogoutSuccess} />
            <div className="messages-container">
                {messages.map((message) => (
                    <div
                        className={`message-bubble ${message.user === currentUser?.username ? 'current-user' : ''}`}
                        key={message.id}
                    >
                        <p>{message.content}</p>

                        <div className="message-footer">
                            <span className="message-info">{message.user} sent at {message.created_at}</span>
                            <div className="vote-section">
                                <div className="vote-button upvote" onClick={() => handleVote(message.id, 'upvote')}></div>
                                <div className="vote-count">{message.votes}</div>
                                <div className="vote-button downvote" onClick={() => handleVote(message.id, 'downvote')}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="message-input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <button onClick={handleSendMessage} className="send-button">Send</button>
            </div>
        </div>
    );
};

export default Chatroom;