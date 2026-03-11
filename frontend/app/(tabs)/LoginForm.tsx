import React from 'react';

const LoginForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in...");
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Welcome!</h2>
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Log in</button>
    </form>
  );
};

export default LoginForm;