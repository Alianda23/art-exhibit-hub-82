import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User } from 'lucide-react';
import CartIcon from './CartIcon';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin, isArtist, isCorporate } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = window.innerWidth < 768;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userType = isAdmin ? 'Admin' : isArtist ? 'Artist' : isCorporate ? 'Corporate' : 'User';

  return (
    <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif font-bold">
          ArtGallery
        </Link>
        
        {/* Desktop Navigation */}
        <div className={`hidden md:flex items-center space-x-6`}>
          <Link
            to="/"
            className={`hover:text-gold ${
              location.pathname === '/' ? 'text-gold font-medium' : ''
            }`}
          >
            Home
          </Link>
          <Link
            to="/artworks"
            className={`hover:text-gold ${
              location.pathname === '/artworks' ? 'text-gold font-medium' : ''
            }`}
          >
            Artworks
          </Link>
          <Link
            to="/exhibitions"
            className={`hover:text-gold ${
              location.pathname === '/exhibitions' ? 'text-gold font-medium' : ''
            }`}
          >
            Exhibitions
          </Link>
          <Link
            to="/contact"
            className={`hover:text-gold ${
              location.pathname === '/contact' ? 'text-gold font-medium' : ''
            }`}
          >
            Contact
          </Link>
          
          <CartIcon />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{userType} Account</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  My Profile
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                {isArtist && (
                  <DropdownMenuItem onClick={() => navigate('/artist')}>
                    Artist Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/cart')}>
                  My Cart
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Login
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>Sign Up</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem onClick={() => navigate('/signup')}>
                    Individual Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/corporate-signup')}>
                    Corporate Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/artist-signup')}>
                    Artist Account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-4">
          <CartIcon />
          
          <button
            className="focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white p-4 absolute top-full left-0 right-0 shadow-md z-50 flex flex-col space-y-4">
          <Link
            to="/"
            className={`py-2 hover:text-gold ${
              location.pathname === '/' ? 'text-gold font-medium' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/artworks"
            className={`py-2 hover:text-gold ${
              location.pathname === '/artworks' ? 'text-gold font-medium' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            Artworks
          </Link>
          <Link
            to="/exhibitions"
            className={`py-2 hover:text-gold ${
              location.pathname === '/exhibitions' ? 'text-gold font-medium' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            Exhibitions
          </Link>
          <Link
            to="/contact"
            className={`py-2 hover:text-gold ${
              location.pathname === '/contact' ? 'text-gold font-medium' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/cart"
            className={`py-2 hover:text-gold ${
              location.pathname === '/cart' ? 'text-gold font-medium' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            Cart
          </Link>
          
          {user ? (
            <>
              <Link
                to="/profile"
                className="py-2 hover:text-gold"
                onClick={() => setIsOpen(false)}
              >
                My Profile
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="py-2 hover:text-gold"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              {isArtist && (
                <Link
                  to="/artist"
                  className="py-2 hover:text-gold"
                  onClick={() => setIsOpen(false)}
                >
                  Artist Dashboard
                </Link>
              )}
              <button
                className="py-2 text-left hover:text-gold"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="py-2 hover:text-gold"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="py-2 hover:text-gold"
                onClick={() => setIsOpen(false)}
              >
                Individual Signup
              </Link>
              <Link
                to="/corporate-signup"
                className="py-2 hover:text-gold"
                onClick={() => setIsOpen(false)}
              >
                Corporate Signup
              </Link>
              <Link
                to="/artist-signup"
                className="py-2 hover:text-gold"
                onClick={() => setIsOpen(false)}
              >
                Artist Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
