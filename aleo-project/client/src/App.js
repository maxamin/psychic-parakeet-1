import React from 'react'
import Task from "./components/Task"
import Login from "./components/Login"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Nav from './components/Nav'
import Comments from './components/Comments'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/task' element={<Task />} />
        <Route path='/coments/:category/:id' element={<Comments />} />
        {/* <Route path='comm' element={<Comments />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App