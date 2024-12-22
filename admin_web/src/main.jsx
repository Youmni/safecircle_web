import { StrictMode, Suspense  } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { AuthProvider } from "./components/authProvider.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <SnackbarProvider maxSnack={1} autoHideDuration={1500} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </Suspense>
  </StrictMode>
);