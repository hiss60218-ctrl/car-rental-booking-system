import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

import Layout from './components/Layout';
import Home from './pages/Home';
import Fleet from './pages/Fleet';
import Branches from './pages/Branches';
import Offers from './pages/Offers';
import Booking from './pages/Booking';
import WhyUs from './pages/WhyUs';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import About from './pages/About';
import Blog from './pages/Blog';
import NotFound from './pages/NotFound';

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminBookings from './pages/admin/AdminBookings';
import AdminLogin from './pages/admin/AdminLogin';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminContent from './pages/admin/AdminContent';
import AdminMessages from './pages/admin/AdminMessages';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { language } = useAppContext();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.className = language === 'ar' ? 'font-cairo' : 'font-sans';
  }, [language]);

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/cars" element={<AdminCars />} />
                <Route path="/bookings" element={<AdminBookings />} />
                <Route path="/customers" element={<AdminCustomers />} />
                <Route path="/content" element={<AdminContent />} />
                <Route path="/messages" element={<AdminMessages />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;