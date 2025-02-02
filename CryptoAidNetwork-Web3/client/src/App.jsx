
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Navbar } from './components';
import { CampaignDetails, CreateCampaign, Home, Profile, Dashboard, SignPage } from './pages';

const App = () => {
  return (
    <div className="relative sm:-8 p-4 bg-custom-black min-h-screen flex flex-row">
      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />

        <Routes>
        <Route path="/signpage" element={<SignPage />} />
          <Route path="/" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<SignPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;
