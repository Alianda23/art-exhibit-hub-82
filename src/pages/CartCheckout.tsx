
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice } from '@/utils/formatters';
import { createImageSrc, handleImageError } from '@/utils/imageUtils';
import { initiateSTKPush } from '@/utils/mpesa';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CartCheckout = () => {
  const { cart, clearCart } = useCart();
  const { user, isCorporate } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(isCorporate ? user?.billingAddress || '' : '');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [invoiceRequested, setInvoiceRequested] = useState(isCorporate);
  const [loading, setLoading] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const corporateDiscount = isCorporate ? 0.1 : 0; // 10% discount for corporate users
  const discountAmount = cart.totalAmount * corporateDiscount;
  const finalAmount = cart.totalAmount - discountAmount;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your purchase",
        variant: "destructive",
      });
      navigate('/login?redirect=/cart/checkout');
      return;
    }
    
    if (!name || !email || !phone || !deliveryAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Process payment based on selected method
      if (paymentMethod === 'mpesa') {
        // We'll handle each item separately for tracking purposes
        for (const item of cart.items) {
          const orderType = item.type === 'artwork' ? 'artwork' : 'exhibition';
          const amount = item.type === 'artwork' 
            ? ((item.item as any).price * item.quantity) * (1 - corporateDiscount)
            : ((item.item as any).ticketPrice * item.quantity) * (1 - corporateDiscount);
            
          const response = await initiateSTKPush(
            phone,
            amount,
            orderType,
            item.id,
            `${orderType}-${item.id}`
          );
          
          if (response.error) {
            throw new Error(response.error);
          }
        }
        
        toast({
          title: "Payment Initiated",
          description: "Please check your phone to complete the payment",
        });
        
        // For demonstration purposes, we'll just simulate a successful payment
        // In a real app, you would wait for the payment callback
        setTimeout(() => {
          clearCart();
          navigate('/payment-success', { 
            state: { 
              orderDetails: {
                items: cart.items,
                totalAmount: finalAmount,
                name,
                email,
                phone,
                deliveryAddress,
                paymentMethod,
                invoiceRequested,
                specialInstructions,
                userType: user.userType,
                discountApplied: corporateDiscount > 0
              } 
            } 
          });
        }, 3000);
        
      } else if (paymentMethod === 'invoice') {
        // For corporate users requesting an invoice
        toast({
          title: "Invoice Requested",
          description: "Your order has been placed. An invoice will be sent to your email.",
        });
        
        clearCart();
        navigate('/payment-success', { 
          state: { 
            orderDetails: {
              items: cart.items,
              totalAmount: finalAmount,
              name,
              email,
              phone,
              deliveryAddress,
              paymentMethod: 'invoice',
              invoiceRequested: true,
              specialInstructions,
              userType: user.userType,
              discountApplied: corporateDiscount > 0
            } 
          } 
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleCheckout} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required
                        placeholder="+254 712 345 678"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Textarea 
                      id="address" 
                      value={deliveryAddress} 
                      onChange={(e) => setDeliveryAddress(e.target.value)} 
                      required
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Select Payment Method</Label>
                      <Select 
                        value={paymentMethod} 
                        onValueChange={setPaymentMethod}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mpesa">M-Pesa</SelectItem>
                          {isCorporate && (
                            <SelectItem value="invoice">Request Invoice</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {isCorporate && (
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="invoice" 
                          checked={invoiceRequested}
                          onChange={(e) => setInvoiceRequested(e.target.checked)}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="invoice" className="cursor-pointer">
                          Request official invoice for this order
                        </Label>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                    <Textarea 
                      id="instructions" 
                      value={specialInstructions} 
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Add any special instructions or notes about your order"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Complete Order (${formatPrice(finalAmount)})`
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {cart.items.map((item) => {
                  const imageSource = item.type === 'artwork' 
                    ? (item.item as any).image_url || (item.item as any).imageUrl 
                    : (item.item as any).imageUrl;
                    
                  const price = item.type === 'artwork' 
                    ? (item.item as any).price 
                    : (item.item as any).ticketPrice;
                    
                  const itemTotal = price * item.quantity;
                  
                  return (
                    <div key={item.id} className="flex items-start">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img 
                          src={createImageSrc(imageSource)} 
                          alt={item.item.title} 
                          className="w-full h-full object-cover rounded"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <div className="font-medium">{item.item.title}</div>
                        <div className="text-sm text-gray-500">
                          {item.type === 'artwork' ? 'Artwork' : 'Exhibition Ticket'}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm">{item.quantity} x {formatPrice(price)}</span>
                          <span className="font-medium">{formatPrice(itemTotal)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.totalAmount)}</span>
                </div>
                
                {isCorporate && (
                  <div className="flex justify-between text-green-600">
                    <span>Corporate Discount (10%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated after purchase</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(finalAmount)}</span>
              </div>

              {isCorporate && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                  <p className="text-sm text-blue-800">
                    Corporate benefits applied: 10% discount on all items.
                    {invoiceRequested && ' Official invoice will be provided.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;
