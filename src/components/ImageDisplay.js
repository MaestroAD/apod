'use client';
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
  Alert,
  AlertTitle,
  Button,
  Typography
} from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import ApodCarousel from './ApodCarousel';
import ApodInfo from './ApodInfo';
import './ImageDisplay.css';

const MIN_APOD_DATE = '1995-06-16';

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ImageDisplay = () => {
  const [imageData, setImageData] = useState([]);
  const [queryParams, setQueryParams] = useState({
    date: '',
    start_date: '',
    end_date: '',
    count: ''
  });
  const [selectedOption, setSelectedOption] = useState('date');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
  const todayDate = getTodayDateString();

  useEffect(() => {
    if (showCarousel) {
      let isMounted = true;

      const fetchImage = async () => {
        setLoading(true);
        setError(null);

        try {
          let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
          const { date, start_date, end_date, count } = queryParams;

          if (date) {
            url += `&date=${date}`;
          } else if (start_date && end_date) {
            url += `&start_date=${start_date}&end_date=${end_date}`;
          } else if (count) {
            url += `&count=${count}`;
          }

          const response = await fetch(url);
          if (!response.ok) {
            let errorMsg = `NASA API error (${response.status}: ${response.statusText})`;
            try {
              const errorData = await response.json();
              if (errorData?.error?.message) {
                errorMsg = errorData.error.message;
              } else if (errorData?.msg) {
                errorMsg = errorData.msg;
              } else if (typeof errorData === 'string') {
                errorMsg = errorData;
              }
            } catch (_) {
              // Non-JSON response fallback
            }
            throw new Error(errorMsg);
          }

          const data = await response.json();
          if (!isMounted) return;

          if (Array.isArray(data)) {
            if (data.length === 0) {
              throw new Error('No images returned for the selected criteria.');
            }
            const responseData = data.map(apodItem => ({
              title: apodItem.title || 'NASA Astronomy Picture',
              date: apodItem.date || '',
              explanation: apodItem.explanation || 'No description provided.',
              media_type: apodItem.media_type,
              url: apodItem.hdurl ? apodItem.hdurl : apodItem.url
            }));
            setImageData(responseData);
            setCarouselIndex(0);
          } else {
            setImageData([{
              title: data.title || 'NASA Astronomy Picture',
              date: data.date || '',
              explanation: data.explanation || 'No description provided.',
              media_type: data.media_type,
              url: data.hdurl ? data.hdurl : data.url
            }]);
            setCarouselIndex(0);
          }
        } catch (err) {
          if (!isMounted) return;
          console.error('Error fetching image:', err);
          setError(err.message || 'An unexpected error occurred while fetching images.');
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      fetchImage();

      return () => {
        isMounted = false;
      };
    }
  }, [API_KEY, queryParams, showCarousel]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQueryParams(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
    setQueryParams({
      date: '',
      start_date: '',
      end_date: '',
      count: ''
    });
    if (error) setError(null);
  };

  const validateInputs = () => {
    const { date, start_date, end_date, count } = queryParams;
    const today = getTodayDateString();

    if (selectedOption === 'date') {
      if (date) {
        if (date < MIN_APOD_DATE) {
          return `Date cannot be earlier than June 16, 1995 (${MIN_APOD_DATE}).`;
        }
        if (date > today) {
          return 'Date cannot be in the future.';
        }
      }
    } else if (selectedOption === 'date_range') {
      if (!start_date || !end_date) {
        return 'Please select both a Start Date and an End Date.';
      }
      if (start_date < MIN_APOD_DATE) {
        return `Start Date cannot be earlier than June 16, 1995 (${MIN_APOD_DATE}).`;
      }
      if (end_date > today) {
        return 'End Date cannot be in the future.';
      }
      if (start_date > end_date) {
        return 'Start Date cannot be later than End Date.';
      }
    } else if (selectedOption === 'count') {
      if (!count || isNaN(count)) {
        return 'Please enter a valid count number.';
      }
      const countNum = Number(count);
      if (countNum < 1 || countNum > 100) {
        return 'Count must be between 1 and 100.';
      }
    }
    return null;
  };

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setShowCarousel(true);
  };

  const handleBack = () => {
    setShowCarousel(false);
    setError(null);
  };

  return (
    <div className='post-main-container'>
      <Header
        showCarousel={showCarousel}
        handleFetchImages={handleSubmit}
        handleBack={handleBack}
        loading={loading}
      />
      <div className={`image-display-container ${showCarousel ? 'carousel-mode' : ''}`}>
        {!showCarousel ? (
          <div className="glass-box-container">
            {error && (
              <Alert
                severity="error"
                onClose={() => setError(null)}
                sx={{
                  width: '100%',
                  backgroundColor: 'rgba(211, 47, 47, 0.25)',
                  color: '#fff',
                  border: '1px solid rgba(211, 47, 47, 0.5)',
                  '& .MuiAlert-icon': { color: '#ff6b6b' }
                }}
              >
                {error}
              </Alert>
            )}
            <FormControl component="fieldset">
              <FormLabel component="legend">Query Type</FormLabel>
              <RadioGroup row value={selectedOption} onChange={handleRadioChange}>
                <FormControlLabel value="date" control={<Radio />} label="Date" />
                <FormControlLabel value="date_range" control={<Radio />} label="Date Range" />
                <FormControlLabel value="count" control={<Radio />} label="Count" />
              </RadioGroup>
            </FormControl>
            <form className="image-display-form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {selectedOption === 'date' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date"
                      InputLabelProps={{ shrink: true }}
                      name="date"
                      value={queryParams.date || ''}
                      onChange={handleInputChange}
                      inputProps={{
                        min: MIN_APOD_DATE,
                        max: todayDate
                      }}
                      helperText={`Optional. Defaults to today. Allowed range: ${MIN_APOD_DATE} to Today.`}
                    />
                  </Grid>
                )}
                {selectedOption === 'date_range' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Start Date"
                        InputLabelProps={{ shrink: true }}
                        name="start_date"
                        value={queryParams.start_date || ''}
                        onChange={handleInputChange}
                        inputProps={{
                          min: MIN_APOD_DATE,
                          max: queryParams.end_date || todayDate
                        }}
                        helperText={`From ${MIN_APOD_DATE}`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="End Date"
                        InputLabelProps={{ shrink: true }}
                        name="end_date"
                        value={queryParams.end_date || ''}
                        onChange={handleInputChange}
                        inputProps={{
                          min: queryParams.start_date || MIN_APOD_DATE,
                          max: todayDate
                        }}
                        helperText="Up to Today"
                      />
                    </Grid>
                  </>
                )}
                {selectedOption === 'count' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Count"
                      name="count"
                      value={queryParams.count || ''}
                      onChange={handleInputChange}
                      inputProps={{
                        min: 1,
                        max: 100
                      }}
                      helperText="Random pictures count (1 - 100)"
                    />
                  </Grid>
                )}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    className="fetch-submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Fetching Images...' : 'Fetch Images'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        ) : loading ? (
          <div className="status-box-container">
            <CircularProgress size={64} thickness={4} sx={{ color: '#fc3c23', mb: 3 }} />
            <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600, mb: 1 }}>
              Connecting to NASA...
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Fetching Astronomy Pictures of the Day
            </Typography>
          </div>
        ) : error ? (
          <div className="status-box-container">
            <Alert
              severity="error"
              sx={{
                width: '100%',
                mb: 3,
                backgroundColor: 'rgba(211, 47, 47, 0.25)',
                color: '#fff',
                border: '1px solid rgba(211, 47, 47, 0.5)',
                '& .MuiAlert-icon': { color: '#ff6b6b' }
              }}
            >
              <AlertTitle sx={{ fontWeight: 'bold' }}>Error Fetching Images</AlertTitle>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={handleBack}
              className="fetch-submit-btn"
            >
              Back to Query Form
            </Button>
          </div>
        ) : imageData.length > 0 ? (
          <div className="carousel-layout">
            <div className="carousel-section">
              <ApodCarousel images={imageData} onChange={setCarouselIndex} />
            </div>
            <div className="info-section">
              <ApodInfo info={imageData[carouselIndex]} />
            </div>
          </div>
        ) : (
          <div className="status-box-container">
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
              No images found for the specified query.
            </Typography>
            <Button
              variant="contained"
              onClick={handleBack}
              className="fetch-submit-btn"
            >
              Back to Query Form
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ImageDisplay;
