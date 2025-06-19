import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HeroUIProvider } from '@heroui/react';
import { ClerkProvider } from '@clerk/clerk-react';


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} 
    navigate={(to) => window.history.pushState(null, '', to)}
    signInUrl="/login">
        <HeroUIProvider>
          <App />
        </HeroUIProvider>
    </ClerkProvider>
  </StrictMode>
);
