import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-center"
          closeButton
          offset={{ top: 88 }}
          mobileOffset={{ top: 84 }}
          toastOptions={{
            classNames: {
              toast:
                'font-sans rounded-2xl border border-ink/10 bg-white text-ink shadow-lift',
              title: 'font-display font-semibold',
              description: 'text-ink/60',
              actionButton: 'bg-ink text-white',
              cancelButton: 'bg-paper text-ink',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
