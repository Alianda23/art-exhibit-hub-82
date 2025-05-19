
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Cart, CartItem, Artwork, Exhibition } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cart: Cart;
  addToCart: (itemType: 'artwork' | 'exhibition', item: Artwork | Exhibition, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (itemId: string) => boolean;
}

interface CartProviderProps {
  children: ReactNode;
}

const initialCart: Cart = {
  items: [],
  totalAmount: 0
};

const CartContext = createContext<CartContextType>({
  cart: initialCart,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isInCart: () => false
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(initialCart);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        // If there's an error, reset the cart
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Calculate total amount whenever cart items change
  useEffect(() => {
    const total = cart.items.reduce((sum, item) => {
      const itemPrice = 'price' in item.item ? item.item.price : 'ticketPrice' in item.item ? item.item.ticketPrice : 0;
      return sum + (itemPrice * item.quantity);
    }, 0);
    
    setCart(prevCart => ({ ...prevCart, totalAmount: total }));
  }, [cart.items]);

  const addToCart = (itemType: 'artwork' | 'exhibition', item: Artwork | Exhibition, quantity: number = 1) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.items.findIndex(
        cartItem => cartItem.id === item.id && cartItem.type === itemType
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        
        toast({
          title: "Updated Cart",
          description: `Increased quantity of ${item.title}`,
        });
        
        return {
          ...prevCart,
          items: updatedItems
        };
      } else {
        // Add new item if it doesn't exist
        const newItem: CartItem = {
          id: item.id,
          type: itemType,
          item: item,
          quantity: quantity,
          addedAt: new Date().toISOString()
        };
        
        toast({
          title: "Added to Cart",
          description: `${item.title} has been added to your cart`,
        });
        
        return {
          ...prevCart,
          items: [...prevCart.items, newItem]
        };
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      
      toast({
        title: "Removed from Cart",
        description: "Item has been removed from your cart",
      });
      
      return {
        ...prevCart,
        items: updatedItems
      };
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
      
      return {
        ...prevCart,
        items: updatedItems
      };
    });
  };

  const clearCart = () => {
    setCart(initialCart);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };

  const isInCart = (itemId: string) => {
    return cart.items.some(item => item.id === itemId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
