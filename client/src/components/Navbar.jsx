import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Navbar = () => {
  const { currentUser } = useSelector(state => state.user)
  return (
    <div className='bg-slate-200 '>
      <div className=" flex justify-between items-cnter max-w-6xl mx-auto p-3">
        <Link to='/'><h1 className="font-bold ">Auth app</h1>
        </Link>
        <ul className=" flex  gap-9">
          <Link to='/'><li>Home</li></Link>
          <Link to='/about'><li>About</li></Link>
          <Link to='/signin'>
            {currentUser ?
              (
                <Link to='/profile'>
                  <img className='h-7 w-7 border-2 rounded-full object-cover' src={currentUser.user.profilePicture} alt="" />
                </Link>
              ) :
              (
                <span>Sign in</span>
              )}
          </Link>
        </ul>
      </div>
    </div >
  )
}

export default Navbar
