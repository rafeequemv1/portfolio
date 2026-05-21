
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
/* Subset weights only — avoids shipping full latin bundles (~20+ woff2 files). */
import './utils/fonts-critical.css';
import './index.css';
import { initAnalyticsWhenIdle } from './utils/analytics';
import { loadCharlaWidgetWhenIdle } from './utils/charlaWidget';
import { loadDisplayFontsWhenIdle } from './utils/loadFonts';

document.getElementById('seo-crawler-fallback')?.remove();

loadDisplayFontsWhenIdle();
initAnalyticsWhenIdle();
loadCharlaWidgetWhenIdle();

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
