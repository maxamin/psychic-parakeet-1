import React from 'react'
import PropTypes from 'prop-types'

function FormField({
  labelName,
  placeholder,
  inputType,
  isTextArea,
  isNotRequired,
  value,
  handleChange
}) {
  const labelDetails = () => {
    if (isNotRequired)
      // the message field
      return (
        <input
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#a5a5a6] dark:border-[#3a3a43] bg-transparent font-epilogue dark:text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
      )
    if (isTextArea)
      return (
        <textarea
          required
          value={value}
          onChange={handleChange}
          rows={10}
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#a5a5a6] dark:border-[#3a3a43] bg-transparent font-epilogue dark:text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
      )
    return (
      <input
        required
        value={value}
        onChange={handleChange}
        type={inputType}
        step="10"
        placeholder={placeholder}
        className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#a5a5a6] dark:border-[#3a3a43] bg-transparent font-epilogue dark:text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
      />
    )
  }

  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] dark:text-[#808191] mb-[10px]">
          {labelName}
        </span>
      )}
      {labelDetails()}
    </label>
  )
}

FormField.propTypes = {
  labelName: PropTypes.string,
  placeholder: PropTypes.string,
  inputType: PropTypes.string.isRequired,
  isTextArea: PropTypes.bool,
  isNotRequired: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleChange: PropTypes.func.isRequired
}

export default FormField
