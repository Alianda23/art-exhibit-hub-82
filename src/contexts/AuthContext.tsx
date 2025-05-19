
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, CorporateUser } from "@/types";
import { 
  loginUser, 
  loginAdmin, 
  loginCorporateUser,
  registerUser,
  registerCorporateUser,
  logout as apiLogout, 
  isAuthenticated as checkIsAuthenticated,
  isAdmin as checkIsAdmin,
  isCorporate as checkIsCorporate
} from "@/services/api";

type AuthContextType = {
  currentUser: User | CorporateUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  corporateLogin: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  corporateSignup: (
    name: string, 
    email: string, 
    password: string, 
    phone: string,
    companyName: string,
    registrationNumber: string,
    taxId: string,
    billingAddress: string,
    contactPerson: string,
    contactPosition: string
  ) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isCorporate: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  adminLogin: async () => false,
  corporateLogin: async () => false,
  signup: async () => false,
  corporateSignup: async () => false,
  logout: () => {},
  isAdmin: false,
  isCorporate: false,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | CorporateUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCorporate, setIsCorporate] = useState<boolean>(false);
  const [isUserAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = checkIsAuthenticated();
        if (isAuthenticated) {
          const userName = localStorage.getItem('userName') || '';
          const userId = localStorage.getItem('userId') || localStorage.getItem('adminId') || 
                         localStorage.getItem('corporateUserId') || '';
          const userIsAdmin = localStorage.getItem('isAdmin') === 'true';
          const userIsCorporate = localStorage.getItem('isCorporate') === 'true';
          
          console.log("Auth check:", { 
            userName, 
            userId, 
            isAdmin: userIsAdmin,
            isCorporate: userIsCorporate,
            token: localStorage.getItem('token')?.substring(0, 20) + '...',
            localStorageIsAdmin: localStorage.getItem('isAdmin')
          });
          
          // Create a basic user object from localStorage
          if (userIsCorporate) {
            setCurrentUser({
              id: userId,
              name: userName,
              email: '',  // We don't store sensitive info in localStorage
              companyName: '', // This would be fetched from the server in a real implementation
              billingAddress: '',
              contactPerson: '',
              allowInvoicing: true
            });
            setIsCorporate(true);
          } else {
            setCurrentUser({
              id: userId,
              name: userName,
              email: '',  // We don't store sensitive info in localStorage
              isAdmin: userIsAdmin,
            });
          }
          
          setIsAdmin(userIsAdmin);
          setIsAuthenticated(true);
        } else {
          console.log("User is not authenticated");
          setCurrentUser(null);
          setIsAdmin(false);
          setIsCorporate(false);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        setCurrentUser(null);
        setIsAdmin(false);
        setIsCorporate(false);
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
      });
      
      setIsAdmin(false);
      setIsCorporate(false);
      setIsAuthenticated(true);
      console.log('AuthContext: Login successful', { name: response.name, isAdmin: false });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Rethrow to handle in component
    }
  };

  // Corporate user login
  const corporateLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('AuthContext: Attempting corporate login', { email });
      const response = await loginCorporateUser({ email, password });
      
      if (response.error) {
        console.log('AuthContext: Corporate login failed', response.error);
        return false;
      }
      
      // Set corporate user state from response
      setCurrentUser({
        id: response.corporate_user_id?.toString() || '',
        name: response.name || '',
        email: email,
        companyName: '', // This would be fetched from the server in a real implementation
        billingAddress: '',
        contactPerson: '',
        allowInvoicing: true
      });
      
      setIsAdmin(false);
      setIsCorporate(true);
      setIsAuthenticated(true);
      console.log('AuthContext: Corporate login successful', { 
        name: response.name, 
        isCorporate: true,
        token: localStorage.getItem('token')?.substring(0, 20) + '...'
      });
      return true;
    } catch (error) {
      console.error("Corporate login error:", error);
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
      setIsCorporate(false);
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
      });
      
      setIsAdmin(false);
      setIsCorporate(false);
      setIsAuthenticated(true);
      console.log('AuthContext: Signup successful');
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      throw error; // Rethrow to handle in component
    }
  };

  // Corporate user signup
  const corporateSignup = async (
    name: string, 
    email: string, 
    password: string, 
    phone: string,
    companyName: string,
    registrationNumber: string,
    taxId: string,
    billingAddress: string,
    contactPerson: string,
    contactPosition: string
  ): Promise<boolean> => {
    try {
      console.log('AuthContext: Attempting corporate signup', { name, email, companyName });
      const response = await registerCorporateUser({ 
        name, 
        email, 
        password, 
        phone,
        companyName,
        registrationNumber,
        taxId,
        billingAddress,
        contactPerson,
        contactPosition
      });
      
      if (response.error) {
        console.log('AuthContext: Corporate signup failed', response.error);
        return false;
      }
      
      // Set user state after successful registration
      setCurrentUser({
        id: response.corporate_user_id?.toString() || '',
        name: name,
        email: email,
        companyName: companyName,
        billingAddress: billingAddress,
        contactPerson: contactPerson,
        allowInvoicing: true
      });
      
      setIsAdmin(false);
      setIsCorporate(true);
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
    setIsCorporate(false);
    setIsAuthenticated(false);
    console.log('AuthContext: User logged out');
  };

  const value = {
    currentUser,
    login,
    adminLogin,
    corporateLogin,
    signup,
    corporateSignup,
    logout,
    isAdmin,
    isCorporate,
    isAuthenticated: isUserAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
