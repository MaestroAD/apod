import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <p>© {new Date().getFullYear()} NASA APOD Viewer</p>
    </div>
  );
};

export default Footer;
