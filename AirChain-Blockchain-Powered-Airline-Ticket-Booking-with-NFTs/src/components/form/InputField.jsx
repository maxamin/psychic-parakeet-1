import React from "react";
import icons from "../icons"
function InputField({ label, setValue, value, type, oneWay }) {

  if (type === 'counter') {
    return (
        <div className="flex w-1/3 rounded-2xl border bg-[rgb(255,255,255,0.7)] py-2 px-4 items-end justify-between">
          <div className=" w-1/3 flex flex-col">
            <p className="text-gray-700">{label}</p>
            <input onChange={(e) => { setValue(e.target.value); }} value={value} className="bg-transparent focus:border-none focus:outline-none font-semibold" />
          </div>
          <div className="w-2/3 flex ">
            <icons.Plus  onClick={() => { setValue((prev) => prev + 1) }} />
            <icons.Minus onClick={() => {
              if (value !== 0) {
                setValue((prev) => prev - 1)
              }
            }} />
          </div>
      </div>
    )
  }

  if (type === 'date') {
    return (
      <div className="w-1/2 flex flex-col rounded-2xl border bg-[rgb(255,255,255,0.7)] py-2 px-4">
        <p className="text-gray-700">{label}</p>
        <input placeholder="Select date" onChange={(e) => { setValue(e.target.value); }} value={value} type="date" className="bg-transparent focus:border-none focus:outline-none font-semibold" />
      </div>
    )
  }


  if (type === 'checkbox') {
    return (
      <div className="flex gap-2 justify-start items-center my-2">
        <p>{label}</p>
        <input onChange={(e) => { setValue(!value); }} value={value} className="accent-[#00c7bb] w-3 h-3" type="checkbox" />
      </div>
    )
  }

  return (
    <div className="flex flex-col rounded-2xl border bg-[rgb(255,255,255,0.7)] py-2 px-4">
      <p className="text-gray-700">{label}</p>
      <input onChange={(e) => { setValue(e.target.value); }}
        value={value} className="outline-none bg-transparent text-black font-semibold" />
    </div>
  );
}

export default InputField;
