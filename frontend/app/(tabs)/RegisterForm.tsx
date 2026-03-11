import React from 'react';

const RegisterForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering...");
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create profile</h2>
      <input type="text" placeholder="Name" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <input type="password" placeholder="Repeat password" required />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;