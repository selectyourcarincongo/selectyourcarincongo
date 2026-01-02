import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/App.css';

// Layout Components
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Pages
import Home from '@/pages/Home';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Vehicles from '@/pages/Vehicles';
import VehicleDetails from '@/pages/VehicleDetails';
import Payment from '@/pages/Payment';
import Dashboard from '@/pages/Dashboard';
import PostVehicle from '@/pages/PostVehicle';
import AdminDashboard from '@/pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="App flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/post-vehicle" element={<PostVehicle />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
