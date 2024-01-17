import React, { useState } from 'react';

interface SignupProps {
    onSignupSuccess: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [signupStatus, setSignupStatus] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSignupStatus(null);

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch('http://127.0.0.1:8000/v1/chatapp/signup', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setSignupStatus('success');
                onSignupSuccess();
                setUsername('');
                setPassword('');
            } else {
                setSignupStatus('error');
            }

            console.log(data);
        } catch (error) {
            setSignupStatus('error');
            console.error('There was an error!', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            {signupStatus === 'success' && <div className="signup-success">Sign Up Successful
                !</div>}
            {signupStatus === 'error' && <div className="signup-error">Sign Up Failed. Please try again.</div>}
        </div>
    );
};

export default Signup;