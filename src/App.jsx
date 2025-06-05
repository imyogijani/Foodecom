import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home/index'
import Header from './Components/Header/index'
import Navbar from './Pages/Home/Navbar'
import Menu from './Pages/Home/Menu'
import Offers from './Pages/Home/Offers'
import Restaurants from './Pages/Home/Restaurants'
import Track from './Pages/Home/Track'
import Footer from './Components/Footer/index'
import Login from './Components/Login/registration'

function LayoutWrapper() {
  const location = useLocation();

  // Define paths where you DON'T want header, navbar, footer
  const hideLayoutPaths = ['/login'];

  const hideLayout = hideLayoutPaths.includes(location.pathname.toLowerCase());

  return (
    <>
      {!hideLayout && <Header />}
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='menu' element={<Menu />} />
        <Route path='offer' element={<Offers />} />
        <Route path='restaurant' element={<Restaurants />} />
        <Route path='trackorder' element={<Track />} />
        <Route path='login' element={<Login />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
}

export default App;
