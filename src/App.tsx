
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

// Regular User Pages
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import ArtworksPage from "@/pages/ArtworksPage";
import ArtworkDetail from "@/pages/ArtworkDetail";
import ExhibitionsPage from "@/pages/ExhibitionsPage";
import ExhibitionDetail from "@/pages/ExhibitionDetail";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import CorporateSignup from "@/pages/CorporateSignup";
import ArtworkCheckout from "@/pages/ArtworkCheckout";
import ExhibitionCheckout from "@/pages/ExhibitionCheckout";
import Payment from "@/pages/Payment";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Profile from "@/pages/Profile";
import CartPage from "@/pages/CartPage";
import CartCheckout from "@/pages/CartCheckout";
import NotFound from "@/pages/NotFound";

// Admin Pages
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import AdminArtworks from "@/pages/AdminArtworks";
import AdminExhibitions from "@/pages/AdminExhibitions";
import AdminMessages from "@/pages/AdminMessages";
import AdminOrders from "@/pages/AdminOrders";
import AdminTickets from "@/pages/AdminTickets";
import AdminArtists from "@/pages/AdminArtists";

// Artist Pages
import Artist from "@/pages/Artist";
import ArtistLogin from "@/pages/ArtistLogin";
import ArtistSignup from "@/pages/ArtistSignup";
import ArtistArtworks from "@/pages/ArtistArtworks";
import ArtistAddArtwork from "@/pages/ArtistAddArtwork";
import ArtistEditArtwork from "@/pages/ArtistEditArtwork";
import ArtistOrders from "@/pages/ArtistOrders";

// Create query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />}>
                <Route index element={<Home />} />
                <Route path="artworks" element={<ArtworksPage />} />
                <Route path="artwork/:id" element={<ArtworkDetail />} />
                <Route path="artwork/checkout/:id" element={<ArtworkCheckout />} />
                <Route path="exhibitions" element={<ExhibitionsPage />} />
                <Route path="exhibition/:id" element={<ExhibitionDetail />} />
                <Route path="exhibition/checkout/:id" element={<ExhibitionCheckout />} />
                <Route path="contact" element={<Contact />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="corporate-signup" element={<CorporateSignup />} />
                <Route path="payment" element={<Payment />} />
                <Route path="payment-success" element={<PaymentSuccess />} />
                <Route path="profile" element={<Profile />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="cart/checkout" element={<CartCheckout />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              
              {/* Admin routes */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/artworks" element={<AdminArtworks />} />
              <Route path="/admin/exhibitions" element={<AdminExhibitions />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/tickets" element={<AdminTickets />} />
              <Route path="/admin/artists" element={<AdminArtists />} />
              
              {/* Artist routes */}
              <Route path="/artist-login" element={<ArtistLogin />} />
              <Route path="/artist-signup" element={<ArtistSignup />} />
              <Route path="/artist" element={<Artist />} />
              <Route path="/artist/artworks" element={<ArtistArtworks />} />
              <Route path="/artist/add-artwork" element={<ArtistAddArtwork />} />
              <Route path="/artist/edit-artwork/:id" element={<ArtistEditArtwork />} />
              <Route path="/artist/orders" element={<ArtistOrders />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
