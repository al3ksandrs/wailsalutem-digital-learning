import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import 'bulma/css/bulma.min.css';
import '@vscode/codicons/dist/codicon.css';
import './css/index.css'
import { RoleProvider } from './navigation/role.config.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RoleProvider>
        <App />
      </RoleProvider>
    </BrowserRouter>
  </React.StrictMode>
)