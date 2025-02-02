import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Link, useNavigate } from 'react-router-dom'
import { logo, moon, sun } from '../assets'
import { navlinks } from '../constants'
import { useStateContext } from '../context'

const Icon = ({ name, imgUrl, isActive, handleClick }) => (
  <div
    className={`w-[55px] h-[55px] rounded-[10px] hover:bg-green-200 dark:hover:bg-[#2c2f32] ${
      isActive && isActive === name && 'bg-green-200 dark:bg-[#2c2f32]'
    } flex justify-center items-center cursor-pointer transition-all duration-300`}
    onClick={handleClick}
  >
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img
        src={imgUrl}
        alt="fund_logo"
        className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`}
      />
    )}
  </div>
)

const Sidebar = () => {
  const navigate = useNavigate()
  const { toggleDarkMode, theme } = useStateContext()
  const [isActive, setIsActive] = useState('dashboard')

  return (
    <div className="flex justify-between flex-col sticky h-[93vh] top-3">
      <Link to="/" className="w-full h-[55px] mb-6">
        <img
          src={logo}
          alt="fund_logo"
          className={'w-full h-full  hover:scale-110 '}
        />
      </Link>
      <div className="flex-1 flex flex-col justify-between items-center bg-light dark:bg-dark rounded-[20px] w-[76px] py-4">
        <div className="flex flex-col items-center justify-center gap-3">
          {navlinks.map((link) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                setIsActive(link.name)
                navigate(link.link)
              }}
            />
          ))}
        </div>
        {/* <Icon
          styles="bg-light bg-slate-900 dark:bg-gray-800 hover:scale-110 transition-all duration-300"
          imgUrl={theme === 'dark' ? sun : moon}
          handleClick={toggleDarkMode}
        /> */}
        <div
          className="w-[55px] h-[55px] rounded-[10px]
          flex justify-center items-center cursor-pointer bg-slate-900 dark:bg-gray-600 hover:scale-110 transition-all duration-300"
          onClick={toggleDarkMode}
        >
          <img
            src={theme === 'dark' ? sun : moon}
            className="w-[43%] h-[43%]"
          />
        </div>
      </div>
    </div>
  )
}

Icon.propTypes = {
  name: PropTypes.string,
  imgUrl: PropTypes.string.isRequired,
  isActive: PropTypes.string,
  handleClick: PropTypes.func.isRequired
}

export default Sidebar
