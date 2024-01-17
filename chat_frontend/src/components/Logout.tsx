import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoutProps {
    onLogoutSuccess: () => void;
}

const Logout: React.FC<LogoutProps> = ({ onLogoutSuccess }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8000/v1/chatapp/logout', {
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Logout successful.');
                navigate('/', { replace: true });
                onLogoutSuccess();
            } else {
                console.error('Logout failed.');
            }
        } catch (error) {
            console.error('Logout request failed:', error);
        }
    };

    return (
        <button className="logout-button" onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
