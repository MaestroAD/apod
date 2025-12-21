'use client';
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import ApodCarousel from './ApodCarousel';
import ApodInfo from './ApodInfo';
import './ImageDisplay.css';

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
  const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;

  useEffect(() => {
    if (showCarousel) {
      const fetchImage = async () => {
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
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          if (Array.isArray(data)) {
            const responseData = data.map(apodItem => ({
              title: apodItem.title,
              date: apodItem.date,
              explanation: apodItem.explanation,
              media_type: apodItem.media_type,
              url: apodItem.hdurl ? apodItem.hdurl : apodItem.url
            }));
            setImageData(responseData);
            setCarouselIndex(0); // Reset carousel index to the first image
          } else {
            setImageData([{
              title: data.title,
              date: data.date,
              explanation: data.explanation,
              media_type: data.media_type,
              url: data.hdurl ? data.hdurl : data.url
            }]);
            setCarouselIndex(0); // Reset carousel index to the first image
          }
        } catch (error) {
          console.error('Error fetching image:', error);
        }
      };

      fetchImage();
    }
  }, [API_KEY, queryParams, showCarousel]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQueryParams({ ...queryParams, [name]: value });
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
    setQueryParams({
      date: '',
      start_date: '',
      end_date: '',
      count: ''
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowCarousel(true);
  };

  const handleBack = () => {
    setShowCarousel(false);
  };

  return (
    <div className='post-main-container'>
      <Header showCarousel={showCarousel} handleFetchImages={handleSubmit} handleBack={handleBack} />
      <div className={`image-display-container ${showCarousel ? 'carousel-mode' : ''}`}>
        {!showCarousel ? (
          <>
            <div className="glass-box-container">
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
                      />
                    </Grid>
                  )}
                </Grid>
              </form>
            </div>
          </>
        ) : (
          <div className="carousel-layout">
            <div className="carousel-section">
              {imageData.length > 0 && (
                <ApodCarousel images={imageData} onChange={setCarouselIndex} />
              )}
            </div>
            <div className="info-section">
              {imageData.length > 0 && (
                <ApodInfo info={imageData[carouselIndex]} />
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ImageDisplay;
