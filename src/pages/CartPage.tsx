
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { createImageSrc, handleImageError } from '@/utils/imageUtils';
import { formatPrice } from '@/utils/formatters';
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <ShoppingCart className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Add some artworks or exhibition tickets to see them here.</p>
          <div className="flex justify-center gap-4">
            <Link to="/artworks">
              <Button>Browse Artworks</Button>
            </Link>
            <Link to="/exhibitions">
              <Button variant="outline">View Exhibitions</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold">Cart Items ({cart.items.length})</h2>
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500">
                Clear All
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => {
                  const imageSource = item.type === 'artwork' 
                    ? (item.item as any).image_url || (item.item as any).imageUrl 
                    : (item.item as any).imageUrl;
                    
                  const price = item.type === 'artwork' 
                    ? (item.item as any).price 
                    : (item.item as any).ticketPrice;
                    
                  const itemTotal = price * item.quantity;
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-16 h-16">
                          <img 
                            src={createImageSrc(imageSource)} 
                            alt={item.item.title} 
                            className="w-full h-full object-cover rounded"
                            onError={handleImageError}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.item.title}</div>
                          <div className="text-sm text-gray-500">
                            {item.type === 'artwork' ? 'Artwork' : 'Exhibition Ticket'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(price)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-3 w-6 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatPrice(itemTotal)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>{formatPrice(cart.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>

              {user?.userType === 'corporate' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                  <p className="text-sm text-blue-800">
                    Corporate discount will be applied at checkout.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" size="lg" asChild>
                <Link to={user ? "/cart/checkout" : "/login?redirect=/cart/checkout"}>
                  Proceed to Checkout
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/artworks">
                  Continue Shopping
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
