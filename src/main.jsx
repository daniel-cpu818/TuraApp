import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'
import "leaflet/dist/leaflet.css";
import "./index.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-3cxwbg8epl8mf648.us.auth0.com"
      clientId="BN6NNwjlDuAiJOxPHmViPZa1IbOkfwf8"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://bookingtura-api",
        scope: "openid profile email"
      }}
      cacheLocation="localstorage" // 🔥 IMPORTANTE para persistencia
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
)