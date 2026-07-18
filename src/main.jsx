import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-xkmh41n67u01oflw.us.auth0.com"
      clientId="dfOEIv6TRct1s6hgx3DenKoqnVvwWGuY"
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