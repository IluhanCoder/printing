import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router';
import Header from './header';
import Router from './router';
import { AuthProvider } from './auth/auth-context';
import "react-datepicker/dist/react-datepicker.css";

function App() {
  return <BrowserRouter>
    <AuthProvider>
      <Header/>
      <Router/> 
    </AuthProvider>
  </BrowserRouter>
}

export default App;
