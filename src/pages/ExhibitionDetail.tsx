
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import ExhibitionDetails from '@/components/ExhibitionDetails';
import { formatPrice } from '@/utils/formatters';
import { ShoppingCart, Check } from 'lucide-react';
import { Exhibition } from '@/types';

const ExhibitionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    const fetchExhibition = async () => {
      try {
        const response = await fetch(`http://localhost:8000/exhibitions/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch exhibition');
        }
        const data = await response.json();
        setExhibition(data);
      } catch (error) {
        console.error('Error fetching exhibition:', error);
        toast({
          title: 'Error',
          description: 'Failed to load exhibition details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExhibition();
  }, [id, toast]);

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to book exhibition tickets',
      });
      navigate(`/login?redirect=/exhibition/${id}`);
      return;
    }

    navigate(`/exhibition/checkout/${id}`);
  };

  const handleAddToCart = () => {
    if (!exhibition) return;
    
    addToCart('exhibition', exhibition);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="flex flex-col gap-8">
            <div className="w-full aspect-video bg-gray-200 rounded-md"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Exhibition Not Found</h2>
        <p className="mb-6">
          Sorry, we couldn't find the exhibition you're looking for.
        </p>
        <Button asChild>
          <Link to="/exhibitions">Browse All Exhibitions</Link>
        </Button>
      </div>
    );
  }

  const isPastExhibition = exhibition.status === 'past';
  const isUpcomingExhibition = exhibition.status === 'upcoming';
  const isOngoingExhibition = exhibition.status === 'ongoing';
  const isSoldOut = exhibition.availableSlots <= 0;
  const canBook = !isPastExhibition && !isSoldOut;

  const inCart = isInCart(exhibition.id);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-6">
        <Link to="/exhibitions" className="text-blue-600 hover:underline">
          ← Back to Exhibitions
        </Link>
      </div>

      <ExhibitionDetails exhibition={exhibition} />

      <div className="mt-8 bg-gray-100 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-2xl font-bold">
              {formatPrice(exhibition.ticketPrice)}
            </h3>
            <p className="text-sm text-gray-600">per ticket</p>
          </div>
          <div className="text-right">
            <p className="font-medium">
              {exhibition.availableSlots} / {exhibition.totalSlots} slots available
            </p>
            <p className="text-sm text-gray-600">
              {isPastExhibition
                ? 'This exhibition has ended'
                : isOngoingExhibition
                ? 'Exhibition ongoing'
                : 'Upcoming exhibition'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleBookNow}
            className="flex-1"
            disabled={!canBook}
          >
            Book Now
          </Button>
          
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="flex-1"
            disabled={!canBook || inCart}
          >
            {inCart ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
        
        {isSoldOut && (
          <p className="text-red-500 text-center mt-3">
            Sorry, this exhibition is sold out.
          </p>
        )}
        {isPastExhibition && (
          <p className="text-gray-500 text-center mt-3">
            This exhibition has already ended.
          </p>
        )}
      </div>
    </div>
  );
};

export default ExhibitionDetail;
