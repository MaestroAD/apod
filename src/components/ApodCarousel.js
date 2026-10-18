'use client';
import React, { useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ApodCarousel = ({ images, onChange }) => {
    const sliderRef = useRef(null);

    const settings = {
        customPaging: function (i) {
            const img = images[i];
            // Only show thumbnails for images to avoid broken img tags for videos
            return (
                <a className="carousel-thumbnail-link">
                    {img?.media_type === 'image' ? (
                        <img src={img.url} alt={`thumb-${i}`} />
                    ) : (
                        <div className="video-thumbnail-placeholder">
                            <span>Video</span>
                        </div>
                    )}
                </a>
            );
        },
        dots: true,
        dotsClass: 'slick-dots slick-thumb',
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (current) => onChange(current),
    };

    // Reset slider when images change significantly (e.g. new search)
    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(0);
        }
    }, [images]);

    return (
        <div className="slider-container">
            <Slider ref={sliderRef} {...settings}>
                {images.map((apodItem, index) => (
                    <div key={index} className="slide-content">
                        {apodItem.media_type === 'image' ? (
                            <img src={apodItem.url} alt={apodItem.title} />
                        ) : apodItem.url?.endsWith('.mp4') ? (
                            <div className="video-container">
                                <video
                                    controls
                                    src={apodItem.url}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 8 }}
                                />
                            </div>
                        ) : (
                            <div className="video-container">
                                <iframe
                                    src={apodItem.url}
                                    title={apodItem.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ApodCarousel;
