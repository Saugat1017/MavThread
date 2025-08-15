import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const[name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
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
      major,
      year,
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

        <div className="grid grid-cols-2 gap-4">
          <select
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 text-white placeholder-white/80"
            required
          >
            <option value="" className="text-gray-800">Select your major</option>
            <option value="Computer Science" className="text-gray-800">Computer Science</option>
            <option value="Computer Engineering" className="text-gray-800">Computer Engineering</option>
            <option value="Electrical Engineering" className="text-gray-800">Electrical Engineering</option>
            <option value="Mechanical Engineering" className="text-gray-800">Mechanical Engineering</option>
            <option value="Civil Engineering" className="text-gray-800">Civil Engineering</option>
            <option value="Chemical Engineering" className="text-gray-800">Chemical Engineering</option>
            <option value="Biomedical Engineering" className="text-gray-800">Biomedical Engineering</option>
            <option value="Aerospace Engineering" className="text-gray-800">Aerospace Engineering</option>
            <option value="Industrial Engineering" className="text-gray-800">Industrial Engineering</option>
            <option value="Mathematics" className="text-gray-800">Mathematics</option>
            <option value="Physics" className="text-gray-800">Physics</option>
            <option value="Chemistry" className="text-gray-800">Chemistry</option>
            <option value="Biology" className="text-gray-800">Biology</option>
            <option value="Business Administration" className="text-gray-800">Business Administration</option>
            <option value="Finance" className="text-gray-800">Finance</option>
            <option value="Marketing" className="text-gray-800">Marketing</option>
            <option value="Accounting" className="text-gray-800">Accounting</option>
            <option value="Economics" className="text-gray-800">Economics</option>
            <option value="Psychology" className="text-gray-800">Psychology</option>
            <option value="Sociology" className="text-gray-800">Sociology</option>
            <option value="Political Science" className="text-gray-800">Political Science</option>
            <option value="History" className="text-gray-800">History</option>
            <option value="English" className="text-gray-800">English</option>
            <option value="Philosophy" className="text-gray-800">Philosophy</option>
            <option value="Art" className="text-gray-800">Art</option>
            <option value="Music" className="text-gray-800">Music</option>
            <option value="Theater" className="text-gray-800">Theater</option>
            <option value="Communications" className="text-gray-800">Communications</option>
            <option value="Journalism" className="text-gray-800">Journalism</option>
            <option value="Education" className="text-gray-800">Education</option>
            <option value="Nursing" className="text-gray-800">Nursing</option>
            <option value="Pre-Medicine" className="text-gray-800">Pre-Medicine</option>
            <option value="Pre-Law" className="text-gray-800">Pre-Law</option>
            <option value="Environmental Science" className="text-gray-800">Environmental Science</option>
            <option value="Geology" className="text-gray-800">Geology</option>
            <option value="Astronomy" className="text-gray-800">Astronomy</option>
            <option value="Other" className="text-gray-800">Other</option>
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 text-white placeholder-white/80"
            required
          >
            <option value="" className="text-gray-800">Select your year</option>
            <option value="Freshman" className="text-gray-800">Freshman</option>
            <option value="Sophomore" className="text-gray-800">Sophomore</option>
            <option value="Junior" className="text-gray-800">Junior</option>
            <option value="Senior" className="text-gray-800">Senior</option>
            <option value="Graduate" className="text-gray-800">Graduate</option>
          </select>
        </div>

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
