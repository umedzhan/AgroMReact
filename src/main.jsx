import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import './i18n'; // Import i18n config
import App from './App.jsx';
import axios from 'axios';

axios.defaults.baseURL = 'https://api.agrom24.uz';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
