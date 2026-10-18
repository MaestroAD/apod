import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import './Header.css';

const Header = ({ showCarousel, handleFetchImages, handleBack, loading = false }) => {
  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NASA APOD Viewer
        </Typography>
        {!showCarousel ? (
          <Button color="inherit" onClick={handleFetchImages} disabled={loading}>
            {loading ? 'Fetching...' : 'Fetch Images'}
          </Button>
        ) : (
          <Button color="inherit" onClick={handleBack}>
            Back to Query Form
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
