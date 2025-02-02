import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useStateContext } from '../context'
import { CustomButton, MetMaskButton } from './'
import { logo, menu, search, profile, moon, sun } from '../assets'
import { navlinks } from '../constants'

const Navbar = () => {
  const navigate = useNavigate()
  const { toggleDarkMode } = useStateContext()
  const [isActive, setIsActive] = useState('dashboard')
  const [toggleDrawer, setToggleDrawer] = useState(false)
  const { connect, address, setSearchQuery, setPage } = useStateContext()

  function handleSearch(Searchquery) {
    setPage(1)
    setSearchQuery(Searchquery)
    navigate('/')
  }

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6 ">
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-light dark:bg-dark rounded-[100px]">
        <input
          type="text"
          placeholder="Search for campaigns"
          onChange={(event) => handleSearch(event.target.value)}
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] dark:text-white bg-transparent outline-none"
        />

        <div className="w-[72px] h-full rounded-[20px] flex justify-center items-center">
          <img
            src={search}
            alt="search"
            className="w-[30px] h-[35px] object-contain"
          />
        </div>
      </div>

      <div className="flex-row justify-end hidden gap-4 sm:flex">
        {address ? (
          <>
            <CustomButton
              btnType="button"
              title="Create a campaign"
              styles="bg-primary"
              handleClick={() => navigate('create-campaign')}
            />
            <Link to="/profile">
              <div className="w-[52px] hover:scale-105 rounded-full bg-light dark:bg-[#2c2f32] flex justify-center items-center cursor-pointer h-[52px]">
                <img
                  src={profile}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
            </Link>
          </>
        ) : (
          <MetMaskButton />
        )}
      </div>

      {/* Small screen navigation */}
      <div className="relative flex items-center justify-between sm:hidden">
        <Link
          to="/"
          className="w-[80px] h-[50px] rounded-[10px] flex justify-center items-center cursor-pointer"
        >
          <img
            src={logo}
            alt="user"
            className="w-full h-full hover:scale-110 "
          />
        </Link>

        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-light dark:bg-[#1c1c24] z-10 shadow-secondary py-4 ${
            !toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && 'bg-green-200 dark:bg-[#3a3a43]'
                } cursor-pointer hover:bg-green-200 dark:hover:bg-[#3a3a43]`}
                onClick={() => {
                  setIsActive(link.name)
                  setToggleDrawer(false)
                  navigate(link.link)
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name ? 'grayscale-0' : 'grayscale'
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name ? 'text-primary' : 'text-[#808191]'
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
            <li
              onClick={() => {
                toggleDarkMode()
                setToggleDrawer(false)
              }}
              className="flex p-4 justify-center bg-[#dad2d2] dark:bg-[#222226] cursor-pointer hover:bg-[#67676872] dark:hover:bg-[#262629]"
            >
              <img
                src={localStorage.theme === 'dark' ? sun : moon}
                alt={localStorage.theme === 'dark' ? 'sun' : 'moon'}
                className="w-[24px] h-[24px] object-contain"
              ></img>
            </li>
          </ul>

          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={address ? 'Create a campaign' : 'Connect'}
              styles={address ? 'bg-primary' : 'bg-[#8c6dfd]  w-full'}
              handleClick={() => {
                if (address) navigate('create-campaign')
                else connect()
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
