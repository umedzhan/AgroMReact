import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import './i18n'; // Import i18n config
import App from './App.jsx';

// axios.defaults.baseURL is not needed as we use Vite proxy locally and Vercel rewrites in production
// effectively making requests to /api/... relative to the domain.'https://api.agrom24.uz';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
