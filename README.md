# NASA APOD Viewer

A modern, responsive web application built with **Next.js** that interfaces with the minimal NASA API to display the Astronomy Picture of the Day (APOD). This project features a custom glassmorphic UI, a parallax star background, and a dedicated image carousel for browsing historical space images.

## Features

- **Next.js App Router**: Utilizing the latest Next.js 14+ features.
- **NASA API Integration**: Fetches daily images and metadata.
- **Glassmorphism UI**: Custom "glass" effect styling with a NASA-inspired color palette.
- **Parallax Star Background**: A pure CSS animated background.
- **Responsive Layout**: Split dashboard view for desktop and stacked layout for mobile.
- **Image Carousel**: Built with `react-slick` for browsing multiple dates.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd apod
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your NASA API key.
    ```env
    NEXT_PUBLIC_NASA_API_KEY=your_api_key_here
    ```
    *You can get a free API Key from [api.nasa.gov](https://api.nasa.gov/).*

### Development

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build and Start

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Deployment on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

### Steps to Deploy

1.  **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2.  **Import to Vercel**:
    - Go to your Vercel Dashboard.
    - Click "Add New..." -> "Project".
    - Import your GitHub repository.
3.  **Configure Environment Variables**:
    - In the "Configure Project" step, locate the **Environment Variables** section.
    - Key: `NEXT_PUBLIC_NASA_API_KEY`
    - Value: `Your Actual NASA API Key`
    - *Note: Do not commit your `.env.local` file to GitHub. Always set secrets in the Vercel dashboard.*
4.  **Deploy**: Click "Deploy". Vercel will build and launch your site automatically.

## Project Structure

```
├── public/              # Static assets (fonts, images, favicon)
├── src/
│   ├── app/             # Next.js App Router root
│   │   ├── layout.js    # Root layout with StarBackground & metadata
│   │   └── page.js      # Main entry point (Home)
│   ├── components/      # React components
│   │   ├── ApodCarousel.js
│   │   ├── ApodInfo.js
│   │   ├── Footer.js
│   │   ├── Header.js
│   │   ├── ImageDisplay.js # Main container logic
│   │   └── StarBackground.js
│   └── index.css        # Global styles and variables
├── next.config.mjs      # Next.js configuration
└── package.json         # Project dependencies and scripts
```

## Technologies

- **Framework**: Next.js
- **UI Library**: Material UI (MUI)
- **Carousel**: React Slick
- **Styling**: CSS Modules & Global CSS
