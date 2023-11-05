import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const targetDOM = document.getElementById('ctxh-avatar-frame');

if (targetDOM) {
  ReactDOM.createRoot(targetDOM).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
