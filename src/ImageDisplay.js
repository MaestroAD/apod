import React, { useState, useEffect } from 'react';
import { Image, Form, Button } from 'react-bootstrap';

const ImageDisplay = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [queryParams, setQueryParams] = useState({
    date: null,
    start_date: null,
    end_date: null,
    count: null
  });
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
        const imageURL = data.url;
        setImageUrl(imageURL);
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

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="dateInput">
          <Form.Label>Date:</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={queryParams.date || ''}
            onChange={handleInputChange}
            disabled={queryParams.start_date || queryParams.end_date || queryParams.count}
          />
        </Form.Group>
        <Form.Group controlId="startDateInput">
          <Form.Label>Start Date:</Form.Label>
          <Form.Control
            type="date"
            name="start_date"
            value={queryParams.start_date || ''}
            onChange={handleInputChange}
            disabled={queryParams.date || queryParams.count}
          />
        </Form.Group>
        <Form.Group controlId="endDateInput">
          <Form.Label>End Date:</Form.Label>
          <Form.Control
            type="date"
            name="end_date"
            value={queryParams.end_date || ''}
            onChange={handleInputChange}
            disabled={queryParams.date || queryParams.count}
          />
        </Form.Group>
        <Form.Group controlId="countInput">
          <Form.Label>Count:</Form.Label>
          <Form.Control
            type="number"
            name="count"
            value={queryParams.count || ''}
            onChange={handleInputChange}
            disabled={queryParams.date || (queryParams.start_date && queryParams.end_date)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Fetch Image
        </Button>
      </Form>
      {imageUrl && <Image src={imageUrl} fluid />}
    </div>
  );
};

export default ImageDisplay;
