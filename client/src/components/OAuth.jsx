import React from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const { displayName, email, photo } = result.user;

            const res = await fetch('api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: displayName,
                    email,
                    photo,
                }),
            });

            // Check if the request was successful
            if (res.ok) {
                const data = await res.json();
                alert(data.message)
                navigate('/')
                dispatch(signInSuccess(data));
            } else {
                // Handle server errors
                dispatch(signInFailure('Server error'));
            }
        } catch (error) {
            // Handle authentication errors
            console.error('Could not login with Google', error);
            dispatch(signInFailure('Authentication error'));
        }
    };

    return (
        <div className=''>
            <button
                type='button'
                onClick={handleGoogleClick}
                className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95 text-center w-full'
            >
                Continue with Google
            </button>
        </div>
    );
};

export default OAuth;
