
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ArtworksPage from './pages/ArtworksPage';
import ArtworkDetail from './pages/ArtworkDetail';
import ExhibitionsPage from './pages/ExhibitionsPage'; 
import ExhibitionDetail from './pages/ExhibitionDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminMessages from './pages/AdminMessages';
import AdminTickets from './pages/AdminTickets';
import AdminArtworks from './pages/AdminArtworks';
import AdminExhibitions from './pages/AdminExhibitions';
import AdminOrders from './pages/AdminOrders';
import AdminArtists from './pages/AdminArtists';
import NotFound from './pages/NotFound';
import ArtworkCheckout from './pages/ArtworkCheckout';
import ExhibitionCheckout from './pages/ExhibitionCheckout';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import ChatBot from './components/ChatBot';
import AdminLayout from './components/AdminLayout';
import ArtistLogin from './pages/ArtistLogin';
import ArtistSignup from './pages/ArtistSignup';
import Artist from './pages/Artist';
import ArtistArtworks from './pages/ArtistArtworks';
import ArtistAddArtwork from './pages/ArtistAddArtwork';
import ArtistEditArtwork from './pages/ArtistEditArtwork';
import ArtistOrders from './pages/ArtistOrders';
import CorporateLogin from './pages/CorporateLogin';
import CorporateSignup from './pages/CorporateSignup';
import Corporate from './pages/Corporate';
import CorporateLayout from './components/CorporateLayout';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><Admin /></AdminLayout>} />
        <Route path="/admin/messages" element={<AdminLayout><AdminMessages /></AdminLayout>} />
        <Route path="/admin/tickets" element={<AdminLayout><AdminTickets /></AdminLayout>} />
        <Route path="/admin/artworks" element={<AdminLayout><AdminArtworks /></AdminLayout>} />
        <Route path="/admin/exhibitions" element={<AdminLayout><AdminExhibitions /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
        <Route path="/admin/artists" element={<AdminLayout><AdminArtists /></AdminLayout>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Artist Routes */}
        <Route path="/artist" element={<Artist />} />
        <Route path="/artist/artworks" element={<ArtistArtworks />} />
        <Route path="/artist/add-artwork" element={<ArtistAddArtwork />} />
        <Route path="/artist/edit-artwork/:id" element={<ArtistEditArtwork />} />
        <Route path="/artist/orders" element={<ArtistOrders />} />
        <Route path="/artist-login" element={<ArtistLogin />} />
        <Route path="/artist-signup" element={<ArtistSignup />} />
        
        {/* Corporate Routes */}
        <Route path="/corporate" element={<CorporateLayout><Corporate /></CorporateLayout>} />
        <Route path="/corporate/orders" element={<CorporateLayout><div className="p-8"><h2 className="text-2xl font-serif mb-4">Corporate Orders</h2><p>This page is under development</p></div></CorporateLayout>} />
        <Route path="/corporate/exhibitions" element={<CorporateLayout><div className="p-8"><h2 className="text-2xl font-serif mb-4">Corporate Exhibitions</h2><p>This page is under development</p></div></CorporateLayout>} />
        <Route path="/corporate/invoices" element={<CorporateLayout><div className="p-8"><h2 className="text-2xl font-serif mb-4">Corporate Invoices</h2><p>This page is under development</p></div></CorporateLayout>} />
        <Route path="/corporate/billing" element={<CorporateLayout><div className="p-8"><h2 className="text-2xl font-serif mb-4">Corporate Billing</h2><p>This page is under development</p></div></CorporateLayout>} />
        <Route path="/corporate/settings" element={<CorporateLayout><div className="p-8"><h2 className="text-2xl font-serif mb-4">Corporate Settings</h2><p>This page is under development</p></div></CorporateLayout>} />
        <Route path="/corporate-login" element={<CorporateLogin />} />
        <Route path="/corporate-signup" element={<CorporateSignup />} />
        
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Home />
            </main>
            <Footer />
            <ChatBot />
          </>
        } />
        <Route path="/artworks" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <ArtworksPage />
            </main>
            <Footer />
            <ChatBot />
          </>
        } />
        <Route path="/artworks/:id" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <ArtworkDetail />
            </main>
            <Footer />
            <ChatBot />
          </>
        } />
        <Route path="/checkout/artwork/:id" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <ArtworkCheckout />
            </main>
            <Footer />
            <ChatBot />
          </>
        } />
        <Route path="/exhibitions" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <ExhibitionsPage />
            </main>
            <Footer />
            <ChatBot />
          </>
        } />
        <Route path="/exhibitions/:id" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <ExhibitionDetail />
            </main>
            <Footer />
            <ChatBot />
          </>
        } />
        <Route path="/checkout/exhibition/:id" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <ExhibitionCheckout />
            </main>
            <Footer />
            <ChatBot />
          </>
        } />
        <Route path="/payment" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Payment />
            </main>
            <Footer />
            <ChatBot />
          </>
        } />
        <Route path="/payment-success" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <PaymentSuccess />
            </main>
            <Footer />
            <ChatBot />
          </>
        } />
        <Route path="/contact" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Contact />
            </main>
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Login />
            </main>
            <Footer />
            <ChatBot />
          </>
        } />
        <Route path="/signup" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Signup />
            </main>
            <Footer />
            <ChatBot />
          </>
        } />
        <Route path="/profile" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Profile />
            </main>
            <Footer />
            <ChatBot />
          </>
        } />
        <Route path="*" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <NotFound />
            </main>
            <Footer />
            <ChatBot />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
