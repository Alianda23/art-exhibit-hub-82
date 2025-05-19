
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/utils/formatters';
import { createImageSrc, handleImageError } from '@/utils/imageUtils';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ShoppingCartProps {
  onClose?: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-center mb-2">Your cart is empty</h3>
        <p className="text-gray-500 text-center mb-4">Add some artworks or exhibition tickets to your cart</p>
        <Button onClick={onClose} variant="outline">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Cart ({cart.items.length} items)</h2>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500">
          Clear All
        </Button>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {cart.items.map((item) => {
          const imageSource = item.type === 'artwork' 
            ? (item.item as any).image_url || (item.item as any).imageUrl 
            : (item.item as any).imageUrl;
            
          const price = item.type === 'artwork' 
            ? (item.item as any).price 
            : (item.item as any).ticketPrice;
            
          const itemTotal = price * item.quantity;

          return (
            <div key={item.id} className="flex border rounded-lg p-3">
              <div className="w-20 h-20 flex-shrink-0">
                <img 
                  src={createImageSrc(imageSource)} 
                  alt={item.item.title} 
                  className="w-full h-full object-cover rounded"
                  onError={handleImageError}
                />
              </div>
              <div className="ml-4 flex-grow flex flex-col">
                <div className="flex justify-between">
                  <h3 className="font-medium">{item.item.title}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFromCart(item.id)}
                    className="h-6 w-6 p-0 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-500 mb-2">
                  {item.type === 'artwork' ? 'Artwork' : 'Exhibition Ticket'}
                </span>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="mx-2 w-6 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{formatPrice(price)} each</div>
                    <div className="font-semibold">{formatPrice(itemTotal)}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-medium">Total</span>
        <span className="text-lg font-bold">{formatPrice(cart.totalAmount)}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={onClose}>
          Continue Shopping
        </Button>
        <Link to="/cart/checkout" onClick={onClose}>
          <Button className="w-full">
            Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ShoppingCart;
