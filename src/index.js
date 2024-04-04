import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import './sac-templates/css/index.css';
import './sac-templates/css/sac-public-website.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from "./App"



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.REACT_APP_BASE_URI}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
