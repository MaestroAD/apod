import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './ImageDisplay.css';

const ImageDisplay = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [queryParams, setQueryParams] = useState({
    date: '',
    start_date: '',
    end_date: '',
    count: ''
  });
  const [selectedOption, setSelectedOption] = useState('date');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const API_KEY = process.env.REACT_APP_NASA_API_KEY;

  useEffect(() => {
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
          const urls = data.map(item => item.hdurl);
          setImageUrls(urls);
          setCarouselIndex(0); // Reset carousel index to the first image
        } else {
          setImageUrls([data.hdurl]);
          setCarouselIndex(0); // Reset carousel index to the first image
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [API_KEY, queryParams]);

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
    // Fetch image when the form is submitted
    // No need to do anything here, useEffect will handle it
  };

  return (
    <Container>
      <div className="image-display-container">
        <Typography variant="h4" gutterBottom>
          NASA APOD Viewer
        </Typography>
        <FormControl component="fieldset">
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
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
            Fetch Images
          </Button>
        </form>
        {imageUrls.length > 0 && (
          <div className="image-display-carousel">
            <Carousel selectedItem={carouselIndex} onChange={(index) => setCarouselIndex(index)} showThumbs={false}>
              {imageUrls.map((url, index) => (
                <div key={index}>
                  <img src={url} alt={`NASA APOD ${index}`} />
                </div>
              ))}
            </Carousel>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ImageDisplay;
