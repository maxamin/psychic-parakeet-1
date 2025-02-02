import React from 'react'
import PropTypes from 'prop-types'

import { useStateContext } from '../context'

const Pagination = ({ currentPage, totalPages }) => {
  const { setPage } = useStateContext()

  function handlePageChange(newPage) {
    if (newPage < 1) return
    if (newPage > totalPages) return
    setPage(newPage)
  }

  const renderPaginationButtons = () => {
    const buttons = []
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <li key={i}>
          <button
            className={`w-10 h-10 bg-[#4acd8d] ${
              i === currentPage ? 'text-white ' : 'text-gray-300'
            } transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-green-700`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      )
    }
    return buttons
  }

  return (
    <div className="flex items-center justify-center">
      <ul className="inline-flex space-x-2">
        <li>
          <button
            className="flex items-center justify-center w-10 h-10 text-[#4acd8d] transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-green-300 dark:hover:bg-green-200"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </button>
        </li>
        {renderPaginationButtons()}
        <li>
          <button
            className="flex items-center justify-center w-10 h-10 hover:scale-110 text-[#4acd8d] transition-colors duration-100 bg-light dark:bg-dark rounded-full focus:shadow-outline hover:bg-green-300 dark:hover:bg-green-300"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </button>
        </li>
      </ul>
    </div>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired
}

export default Pagination
