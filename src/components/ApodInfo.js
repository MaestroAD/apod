// 'use client';
import React from 'react';

const ApodInfo = ({ info }) => {
    if (!info) return null;

    return (
        <div className='image-display-apod-data'>
            <h1>
                <span>{info.title}</span> | <span>{info.date}</span>
            </h1>
            <p>{info.explanation}</p>
        </div>
    );
};

export default ApodInfo;
