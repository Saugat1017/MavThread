import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const[name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (password !== confirmPassword) {
    //   alert('Passwords do not match');
    //   return;
    // }

    const data = {
      name,
      email,
      password,
    };

    try {
      const res = await fetch('http://localhost:8082/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Sign up failed');
        return;
      }

      const result = await res.json();
      console.log('Signup success:', result);
      alert('Signup successful!');
      navigate('/login'); // Navigate to login page on success
    } catch (error) {
      console.error('SIGNUP ERROR:', error);
      alert('An error occurred during signup.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr  from-black via-slate-900 to-black px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-white space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">
          Sign Up for <span className="text-lime-300">MavThread</span>
        </h2>

          <input
          type="text"
          placeholder="Name"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        /> */}

        <button
          type="submit"
          className="w-full py-3 bg-lime-400 hover:bg-lime-300 text-white font-semibold rounded-md transition-all"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-white/80">
          Already have an account?{' '}
          <button
            type="button"
            className="text-lime-300 hover:underline"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
}
