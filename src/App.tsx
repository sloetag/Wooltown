/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence } from 'motion/react';
import { PageLayout } from './components/layout/PageLayout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Contact } from './pages/Contact';
import { ShippingReturns } from './pages/ShippingReturns';
import { FAQ } from './pages/FAQ';
import { Profile } from './pages/Profile';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { NewArrivals } from './pages/NewArrivals';
import { Vendor } from './pages/Vendor';
import { Wishlist } from './pages/Wishlist';
import { About } from './pages/About';
import { Admin } from './pages/Admin';
import { Loader } from './components/layout/Loader';
import { CookieConsent } from './components/ui/CookieConsent';

gsap.registerPlugin(ScrollTrigger);

function AnimatedRoutes() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      {/* @ts-expect-error - React Router 6 RoutesProps doesn't include the standard React key attribute in its type definition but it works */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shipping-returns" element={<ShippingReturns />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/vendor" element={<Vendor />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <AnimatePresence>
        {loading && <Loader key="loader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      {!loading && (
        <>
          <PageLayout>
            <AnimatedRoutes />
          </PageLayout>
          <CookieConsent />
        </>
      )}
    </Router>
  );
}
