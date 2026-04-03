import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js'; // Ensure the extension points to your new .js file

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    React.createElement(
        StrictMode,
        null,
        React.createElement(App, null)
    )
);