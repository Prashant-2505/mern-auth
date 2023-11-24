import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (!data.success) {
        setError(true)
        return
      }
      else {
        alert(data.message)
        navigate('/signin')
      }
    } catch (error) {
      setLoading(false);
      setError(true)
    }
  };

  return (
    <div className='p-4 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold'>Sign Up</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4 pt-10'>
        <input
          type='text'
          placeholder='name'
          id='name'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />

        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading.....' : 'Sign up'}
        </button>
        <OAuth />
      </form>

      <div className='flex gap-2 mt-5'>
        <p className=''>Have an account</p>
        <Link to='/signin'>
          <span className='text-blue-500 '>Sign in</span>
        </Link>
      </div>
      <p className='text-red-400 mt-5'>{error && 'Something went Wrong'}</p>
    </div>
  );
};

export default SignUp;
