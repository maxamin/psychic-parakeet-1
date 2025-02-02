import React from "react";
import bioname from "../biometra.png";
import bionameDark from "../biometradark.png";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Home({ darkMode }) {
  const navigate = useNavigate();
  const logoImage = darkMode ? bionameDark : bioname;

  return (
    <>
      <div className="content">
        <img src={logoImage} alt="logo" className="frontPageLogo" />
        
        <h4 className="h4">Welcome Back!</h4>
        <Button
          onClick={() => navigate("/yourwallet")}
          className="frontPageButton"
          type="primary"
        >
          Create A Wallet
        </Button>
        <Button
          onClick={() => navigate("/recover")}
          className="frontPageButton"
          type="default"
        >
          Sign In With Seed Phrase
        </Button>
        <p className="frontPageBottom">Copyright © Biometra</p>
      </div>
    </>
  );
}

export default Home;
