import React,{ useState } from 'react';


import Herom from './components/mobilefirstApproach/Herom';
import Skillsm from './components/mobilefirstApproach/Skillsm';

import './App.css'
import Projectsm from './components/mobilefirstApproach/Projectsm';
import Experiencem from './components/mobilefirstApproach/Experiencem';
import Educationm  from './components/mobilefirstApproach/Educationm';
import Contactm from './components/mobilefirstApproach/Contactm';
import Footerm from './components/mobilefirstApproach/Footerm';
import {  TrackingProvider } from './components/context';
// import "./index.css"



function App() {


  

  return (
    < TrackingProvider>

    <div className='bg-[#ffffff]'>

    {/* <Navbarm /> */}
    <section id="hero"> <Herom   /> </section>
    <section id="skills"> <Skillsm /> </section>
    
    <section id="projects"> <Projectsm  /> </section>
    <section id="experience"> <Experiencem  /> </section>
    <section id="education"><Educationm /></section>
    <Contactm />
    <Footerm />
    
    
    {/* <Hero />
   
    <Skills />
    <Projects />
    <Experience />
    <Education />
    
    <Contact />
    <Footer /> */}

    </div>


    
    </ TrackingProvider>
  )
}

export default App
