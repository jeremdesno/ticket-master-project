import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from '../api/authService';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../contexts/AuthContext';

const LoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    await login(username, password);
    await checkAuth();
    navigate('/home');
  };

  return (
    <LoginForm
      username={username}
      password={password}
      onUsernameTermChange={handleUsernameChange}
      onPasswordTermChange={handlePasswordChange}
      onLogin={handleLogin}
    />
  );
};

export default LoginContainer;
