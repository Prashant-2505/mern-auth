import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux'

const SignIn = () => {
  const [formData, setFormData] = useState({});

  const { loading, error } = useSelector((state) => state.user)

  const navigate = useNavigate()
  const dispatch = useDispatch()



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      dispatch(signInStart())

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        dispatch(signInSuccess(data))
        navigate('/')
      }
      else if (!data.success) {
        dispatch(signInFailure(data))
        return
      }

    } catch (error) {
      dispatch(signInFailure(error))
    }
  };

  return (
    <div className='p-4 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold'>Sign In</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4 pt-10'>

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
          {loading ? 'Loading.....' : 'Sign In'}
        </button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p className=''>Don't have an account</p>
        <Link to='/signup'>
          <span className='text-blue-500 '>Sign up</span>
        </Link>
      </div>
      <p className='text-red-400 mt-5'>{error.message ? error.message || 'Something went Wrong':""}</p>
    </div>
  );
};

export default SignIn;
