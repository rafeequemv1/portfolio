
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
/* Subset weights only — avoids shipping full latin bundles (~20+ woff2 files). */
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-600.css';
import './index.css';
import { initAnalyticsWhenIdle } from './utils/analytics';
import { loadDisplayFontsWhenIdle } from './utils/loadFonts';

document.getElementById('seo-crawler-fallback')?.remove();

loadDisplayFontsWhenIdle();
initAnalyticsWhenIdle();

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
