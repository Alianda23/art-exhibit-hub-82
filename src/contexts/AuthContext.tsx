
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { 
  loginUser, 
  loginAdmin, 
  registerUser,
  registerCorporateUser,
  logout as apiLogout, 
  isAuthenticated as checkIsAuthenticated,
  isAdmin as checkIsAdmin
} from "@/services/api";

type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  signupCorporate: (
    name: string, 
    email: string, 
    password: string, 
    phone: string, 
    companyName: string, 
    businessType: string, 
    taxId?: string
  ) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  adminLogin: async () => false,
  signup: async () => false,
  signupCorporate: async () => false,
  logout: () => {},
  isAdmin: false,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isUserAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = checkIsAuthenticated();
        if (isAuthenticated) {
          const userName = localStorage.getItem('userName') || '';
          const userId = localStorage.getItem('userId') || localStorage.getItem('adminId') || '';
          const userIsAdmin = localStorage.getItem('isAdmin') === 'true';
          const userIsCorporate = localStorage.getItem('isCorporate') === 'true';
          const companyName = localStorage.getItem('companyName') || '';
          const businessType = localStorage.getItem('businessType') || '';
          const taxId = localStorage.getItem('taxId') || '';
          
          console.log("Auth check:", { 
            userName, 
            userId, 
            isAdmin: userIsAdmin,
            isCorporate: userIsCorporate,
            token: localStorage.getItem('token')?.substring(0, 20) + '...',
            localStorageIsAdmin: localStorage.getItem('isAdmin')
          });
          
          // Create a basic user object from localStorage
          setCurrentUser({
            id: userId,
            name: userName,
            email: '',  // We don't store sensitive info in localStorage
            isAdmin: userIsAdmin,
            isCorporate: userIsCorporate,
            companyName: companyName || undefined,
            businessType: businessType || undefined,
            taxId: taxId || undefined
          });
          
          setIsAdmin(userIsAdmin);
          setIsAuthenticated(true);
        } else {
          console.log("User is not authenticated");
          setCurrentUser(null);
          setIsAdmin(false);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        setCurrentUser(null);
        setIsAdmin(false);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  // Regular user login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('AuthContext: Attempting user login', { email });
      const response = await loginUser({ email, password });
      
      if (response.error) {
        console.log('AuthContext: Login failed', response.error);
        return false;
      }
      
      // Set user state from response
      setCurrentUser({
        id: response.user_id?.toString() || '',
        name: response.name || '',
        email: email,
        isAdmin: false,
        isCorporate: response.is_corporate === true,
        companyName: response.company_name || undefined,
        businessType: response.business_type || undefined,
        taxId: response.tax_id || undefined
      });
      
      setIsAdmin(false);
      setIsAuthenticated(true);
      console.log('AuthContext: Login successful', { 
        name: response.name, 
        isAdmin: false, 
        isCorporate: response.is_corporate === true 
      });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Rethrow to handle in component
    }
  };

  // Admin login
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('AuthContext: Attempting admin login', { email });
      const response = await loginAdmin({ email, password });
      
      if (response.error) {
        console.log('AuthContext: Admin login failed', response.error);
        return false;
      }
      
      // Set admin user state
      setCurrentUser({
        id: response.admin_id?.toString() || '',
        name: response.name || '',
        email: email,
        isAdmin: true,
      });
      
      setIsAdmin(true);
      setIsAuthenticated(true);
      console.log('AuthContext: Admin login successful', { 
        name: response.name, 
        isAdmin: true,
        token: localStorage.getItem('token')?.substring(0, 20) + '...'
      });
      return true;
    } catch (error) {
      console.error("Admin login error:", error);
      throw error; // Rethrow to handle in component
    }
  };
  
  // User signup
  const signup = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    try {
      console.log('AuthContext: Attempting signup', { name, email });
      const response = await registerUser({ name, email, password, phone });
      
      if (response.error) {
        console.log('AuthContext: Signup failed', response.error);
        return false;
      }
      
      // Set user state after successful registration
      setCurrentUser({
        id: response.user_id?.toString() || '',
        name: name,
        email: email,
        isAdmin: false,
        isCorporate: false
      });
      
      setIsAdmin(false);
      setIsAuthenticated(true);
      console.log('AuthContext: Signup successful');
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      throw error; // Rethrow to handle in component
    }
  };

  // Corporate user signup
  const signupCorporate = async (
    name: string, 
    email: string, 
    password: string, 
    phone: string,
    companyName: string,
    businessType: string,
    taxId?: string
  ): Promise<boolean> => {
    try {
      console.log('AuthContext: Attempting corporate signup', { name, email, companyName });
      const response = await registerCorporateUser({ 
        name, 
        email, 
        password, 
        phone, 
        company_name: companyName,
        business_type: businessType,
        tax_id: taxId || ''
      });
      
      if (response.error) {
        console.log('AuthContext: Corporate signup failed', response.error);
        return false;
      }
      
      // Set user state after successful registration
      setCurrentUser({
        id: response.user_id?.toString() || '',
        name: name,
        email: email,
        isAdmin: false,
        isCorporate: true,
        companyName,
        businessType,
        taxId
      });
      
      setIsAdmin(false);
      setIsAuthenticated(true);
      console.log('AuthContext: Corporate signup successful');
      return true;
    } catch (error) {
      console.error("Corporate signup error:", error);
      throw error; // Rethrow to handle in component
    }
  };

  // Logout
  const logout = () => {
    apiLogout();
    setCurrentUser(null);
    setIsAdmin(false);
    setIsAuthenticated(false);
    console.log('AuthContext: User logged out');
  };

  const value = {
    currentUser,
    login,
    adminLogin,
    signup,
    signupCorporate,
    logout,
    isAdmin,
    isAuthenticated: isUserAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
