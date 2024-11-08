import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { ConfigProvider } from 'antd';
import frFR from 'antd/locale/fr_FR';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider
    locale={frFR}
    theme={{
      "token": {
        "colorPrimary": "#00adb5",
        "colorInfo": "#00adb5"
      }
    }}>
    {/* <React.StrictMode> */}
    <App />
    {/* </React.StrictMode> */}
  </ConfigProvider>
);
