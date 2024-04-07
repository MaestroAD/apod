import React from 'react';
import './App.css';
import ImageDisplay from './ImageDisplay';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <h1>Image Viewer</h1>
      </header>
      <main>
        <ImageDisplay />
      </main>
    </div>
  );
}

export default App;
