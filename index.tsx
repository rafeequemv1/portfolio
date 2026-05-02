
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/inter/latin.css';
import '@fontsource/cormorant-garamond/latin.css';
import '@fontsource/dancing-script/latin.css';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
