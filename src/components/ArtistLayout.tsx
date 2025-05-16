
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isArtist, logout } from '@/services/api';
import { Button } from '@/components/ui/button';
import { User, LogOut, PlusCircle, ShoppingBag, Image } from 'lucide-react';

interface ArtistLayoutProps {
  children: React.ReactNode;
}

const ArtistLayout: React.FC<ArtistLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  
  // Check if user is an artist
  React.useEffect(() => {
    if (!isArtist()) {
      navigate('/artist-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/artist-login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="bg-gray-900 text-white w-64 flex-shrink-0">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Artist Portal</h1>
        </div>
        
        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/artist" 
                className="block px-4 py-3 hover:bg-gray-800 transition-colors flex items-center"
              >
                <User className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/artist/artworks" 
                className="block px-4 py-3 hover:bg-gray-800 transition-colors flex items-center"
              >
                <Image className="mr-3 h-5 w-5" />
                My Artworks
              </Link>
            </li>
            <li>
              <Link 
                to="/artist/add-artwork" 
                className="block px-4 py-3 hover:bg-gray-800 transition-colors flex items-center"
              >
                <PlusCircle className="mr-3 h-5 w-5" />
                Add Artwork
              </Link>
            </li>
            <li>
              <Link 
                to="/artist/orders" 
                className="block px-4 py-3 hover:bg-gray-800 transition-colors flex items-center"
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                Orders
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4">
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-gray-800"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-x-auto bg-gray-50">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ArtistLayout;
