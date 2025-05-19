import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  currentUser: User | null; // Add this property
  isLoading: boolean;
  isAdmin: boolean;
  isArtist: boolean;
  isCorporate: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  signupCorporate: (companyName: string, email: string, password: string, phone: string, taxId: string, billingAddress: string) => Promise<boolean>;
  loginArtist: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>; // Add this property
  signupArtist: (name: string, email: string, password: string, phone: string, bio: string) => Promise<boolean>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const API_URL = 'http://localhost:8000';

const AuthContext = createContext<AuthContextType>({
  user: null,
  currentUser: null, // Add this property
  isLoading: true,
  isAdmin: false,
  isArtist: false,
  isCorporate: false,
  login: async () => false,
  logout: () => {},
  signup: async () => false,
  signupCorporate: async () => false,
  loginArtist: async () => false,
  adminLogin: async () => false, // Add this property
  signupArtist: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if the user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userType = localStorage.getItem('userType');
    const isAdminStr = localStorage.getItem('isAdmin');
    const isArtistStr = localStorage.getItem('isArtist');
    const companyName = localStorage.getItem('companyName');
    const taxId = localStorage.getItem('taxId');
    const billingAddress = localStorage.getItem('billingAddress');
    
    if (token && userId && userName) {
      setUser({
        id: userId,
        name: userName,
        email: '',  // Email is not stored in localStorage for security reasons
        isAdmin: isAdminStr === 'true',
        userType: userType as 'individual' | 'corporate' | undefined,
        companyName: companyName || undefined,
        taxId: taxId || undefined,
        billingAddress: billingAddress || undefined
      });
    }
    
    setIsLoading(false);
    
    // Check if token is about to expire
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (tokenExpiry) {
      const expiryDate = new Date(tokenExpiry);
      const now = new Date();
      const timeToExpiry = expiryDate.getTime() - now.getTime();
      
      // If token expires in less than 1 hour, show a warning
      if (timeToExpiry < 3600000 && timeToExpiry > 0) {
        toast({
          title: "Session Expiring",
          description: "Your session will expire soon. Please log in again to continue.",
        });
      }
      
      // If token has expired, log out
      if (timeToExpiry <= 0) {
        logout();
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token and user info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user_id);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userType', data.userType || 'individual');
        localStorage.setItem('isAdmin', 'false');
        localStorage.setItem('isArtist', 'false');
        
        if (data.userType === 'corporate' && data.companyName) {
          localStorage.setItem('companyName', data.companyName);
          localStorage.setItem('taxId', data.taxId || '');
          localStorage.setItem('billingAddress', data.billingAddress || '');
        }
        
        // Set token expiry (24 hours from now)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);
        localStorage.setItem('tokenExpiry', expiryDate.toISOString());
        
        // Update user state
        setUser({
          id: data.user_id,
          name: data.name,
          email: email,
          isAdmin: false,
          userType: data.userType || 'individual',
          companyName: data.companyName,
          taxId: data.taxId,
          billingAddress: data.billingAddress
        });
        
        return true;
      } else {
        console.error('Login failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, phone: string) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token and user info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user_id);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userType', 'individual');
        localStorage.setItem('isAdmin', 'false');
        localStorage.setItem('isArtist', 'false');
        
        // Set token expiry (24 hours from now)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);
        localStorage.setItem('tokenExpiry', expiryDate.toISOString());
        
        // Update user state
        setUser({
          id: data.user_id,
          name: data.name,
          email: email,
          isAdmin: false,
          userType: 'individual'
        });
        
        return true;
      } else {
        console.error('Signup failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error during signup:', error);
      return false;
    }
  };

  const signupCorporate = async (
    companyName: string, 
    email: string, 
    password: string, 
    phone: string, 
    taxId: string, 
    billingAddress: string
  ) => {
    try {
      const response = await fetch(`${API_URL}/register-corporate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          companyName, 
          email, 
          password, 
          phone, 
          taxId, 
          billingAddress,
          userType: 'corporate'
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token and user info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user_id);
        localStorage.setItem('userName', data.companyName);
        localStorage.setItem('userType', 'corporate');
        localStorage.setItem('companyName', companyName);
        localStorage.setItem('taxId', taxId);
        localStorage.setItem('billingAddress', billingAddress);
        localStorage.setItem('isAdmin', 'false');
        localStorage.setItem('isArtist', 'false');
        
        // Set token expiry (24 hours from now)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);
        localStorage.setItem('tokenExpiry', expiryDate.toISOString());
        
        // Update user state
        setUser({
          id: data.user_id,
          name: companyName,
          email: email,
          phone: phone,
          isAdmin: false,
          userType: 'corporate',
          companyName: companyName,
          taxId: taxId,
          billingAddress: billingAddress
        });
        
        return true;
      } else {
        console.error('Corporate signup failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error during corporate signup:', error);
      return false;
    }
  };

  const loginArtist = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/artist-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token and artist info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.artist_id);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('isArtist', 'true');
        localStorage.setItem('isAdmin', 'false');
        
        // Set token expiry (24 hours from now)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);
        localStorage.setItem('tokenExpiry', expiryDate.toISOString());
        
        // Update user state
        setUser({
          id: data.artist_id,
          name: data.name,
          email: email,
          isAdmin: false
        });
        
        return true;
      } else {
        console.error('Artist login failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error during artist login:', error);
      return false;
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token and admin info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.admin_id);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('isArtist', 'false');
        
        // Set token expiry (24 hours from now)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);
        localStorage.setItem('tokenExpiry', expiryDate.toISOString());
        
        // Update user state
        setUser({
          id: data.admin_id,
          name: data.name,
          email: email,
          isAdmin: true
        });
        
        return true;
      } else {
        console.error('Admin login failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error during admin login:', error);
      return false;
    }
  };

  const signupArtist = async (name: string, email: string, password: string, phone: string, bio: string) => {
    try {
      const response = await fetch(`${API_URL}/register-artist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone, bio }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token and artist info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.artist_id);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('isArtist', 'true');
        localStorage.setItem('isAdmin', 'false');
        
        // Set token expiry (24 hours from now)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);
        localStorage.setItem('tokenExpiry', expiryDate.toISOString());
        
        // Update user state
        setUser({
          id: data.artist_id,
          name: data.name,
          email: email,
          isAdmin: false
        });
        
        return true;
      } else {
        console.error('Artist signup failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error during artist signup:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isArtist');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userType');
    localStorage.removeItem('companyName');
    localStorage.removeItem('taxId');
    localStorage.removeItem('billingAddress');
    localStorage.removeItem('cart');
    
    // Clear user state
    setUser(null);
  };

  const isAdmin = user?.isAdmin || false;
  const isArtist = localStorage.getItem('isArtist') === 'true';
  const isCorporate = user?.userType === 'corporate';

  // Add the currentUser property to make it compatible with existing code
  const currentUser = user;

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser, // Add this property
        isLoading,
        isAdmin,
        isArtist,
        isCorporate,
        login,
        logout,
        signup,
        signupCorporate,
        loginArtist,
        adminLogin, // Add this property
        signupArtist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
