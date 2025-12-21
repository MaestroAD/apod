import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-left">
        <p>© {new Date().getFullYear()} NASA APOD Viewer</p>
      </div>
      <div className="footer-right">
        <img
          src="/images/nasa-apod-logo.png"
          alt="NASA APOD Logo"
          className="footer-logo-apod"
        />
        <img
          src="/images/nasa-6.svg"
          alt="NASA Logo"
          className="footer-logo-nasa"
        />
      </div>
    </div>
  );
};

export default Footer;
