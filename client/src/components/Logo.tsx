import React from 'react';
import capImg from '../assets/graduation-cap-white.png';
import '../css/logo.css';

const Logo: React.FC = () => {
  return (
    <div className="logo-container">
      <div className="logo-wrapper">
        <img 
          src={capImg} 
          alt="Graduation Cap" 
          className="logo-img"
        />
        <span className="logo-text">
          LeerMatch
        </span>
      </div>
      <p className="logo-slogan">
        Leerlingen verbinden met de juiste docenten
      </p>
    </div>
  );
};

export default Logo;