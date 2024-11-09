import React from 'react';

import styles from '../styles/components/LoginForm.module.css';

interface LoginFormProps {
  username: string;
  password: string;
  onUsernameTermChange: React.ChangeEventHandler<HTMLInputElement>;
  onPasswordTermChange: React.ChangeEventHandler<HTMLInputElement>;
  onLogin: (e: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  username,
  password,
  onUsernameTermChange,
  onPasswordTermChange,
  onLogin,
}): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <form className={styles.loginForm} onSubmit={onLogin}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={onUsernameTermChange}
          required
          className={styles.inputField}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={onPasswordTermChange}
          required
          className={styles.inputField}
        />
        <button type="submit" className={styles.submitButton}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
