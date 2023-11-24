import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebase';
import { useDispatch } from 'react-redux';
import { updateUserFailure, updateUserSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutUserStart, signoutUserSuccess, signoutUserFailure } from '../redux/user/userSlice.js'
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch()

  const [name, setName] = useState(currentUser.user.name);
  const [email, setEmail] = useState(currentUser.user.email);
  const [profilePicture, setProfilePicture] = useState(currentUser.user.profilePicture);
  const [password, setPassword] = useState('');
  const fileRef = useRef(null);

  const [image, setImage] = useState(undefined);
  const [imagePercentage, setImagePercentage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);

  const handleImageUpload = (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercentage(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProfilePicture(downloadURL);
        });
      }
    );
  };

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'name':
        setName(e.target.value);
        break;
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/update/${currentUser.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          profilePicture,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update user profile');
      }

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return
      }
      setUpdateSuccess(true);
      dispatch(updateUserSuccess(data))
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const deleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser.user.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success === false) {
        alert('Error occurred while deleting user');
        dispatch(deleteUserFailure(data));
      } else {
        alert('Deleting user successfully');
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const signOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch(`/api/auth/signout`, {
        method: 'GET',
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signoutUserFailure(data))
        alert('Error occurred while Sign out');
      } else {
        alert('Sign out successfully');
        dispatch(signoutUserSuccess(data));
        navigate('/signin')
      }
    } catch (error) {
      console.error('Error in sign out :', error);
    }
  };

  const showPassword = () => {
    setPasswordVisible(!passwordVisible)
  }


  return (
    <div className=''>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center'>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          className='h-[5rem] w-[5rem] rounded-full mb-5 cursor-pointer'
          src={profilePicture}
          alt=""
        />
        <p>
          {imageError ? (
            <span className="text-red-700">{`Uploading: ${imagePercentage}%`}</span>
          ) : (
            updateSuccess ? (
              <span className="text-green-700">{'Update Successful'}</span>
            ) : (
              <span className="text-green-700">{'Ready to Update'}</span>
            )
          )}
        </p>

        <input
          className='m-1 p-3 bg-gray-200 rounded-md w-[40%]'
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          className='m-1 p-3 bg-gray-200 rounded-md w-[40%]'
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
        />

        <div className=" m-1  bg-gray-200 rounded-md flex w-[40%] items-center">
          <input
            className='  rounded-md p-3 h-[100%] w-[90%] bg-gray-200 focus:outline-none focus:border-transparent'
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Password"
          />
          <FaEyeSlash onClick={showPassword} className=' cursor-pointer' />
        </div>


        <button
          className='bg-gray-500 w-[40%] mt-1 rounded-md p-3 text-white uppercase hover:opacity-95'
          type="submit"
        >
          Update
        </button>

        <div className="flex justify-between w-[40%] mt-4">
          <p onClick={deleteUser} className='text-red-600 cursor-pointer hover:text-red-800 hover:font-bold'>Delete Account</p>
          <p onClick={signOut} className='text-red-600 cursor-pointer hover:text-red-800 hover:font-bold'>Sign out</p>
        </div>
      </form>
    </div>
  );
};

export default Profile;
