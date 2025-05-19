
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/formatters';
import { createImageSrc, handleImageError } from '@/utils/imageUtils';
import { ShoppingCart, Check } from 'lucide-react';
import ArtworkRecommendations from '@/components/ArtworkRecommendations';
import { Artwork } from '@/types';

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const response = await fetch(`http://localhost:8000/artworks/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch artwork');
        }
        const data = await response.json();
        setArtwork(data);
      } catch (error) {
        console.error('Error fetching artwork:', error);
        toast({
          title: 'Error',
          description: 'Failed to load artwork details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to purchase artwork',
      });
      navigate(`/login?redirect=/artwork/${id}`);
      return;
    }

    navigate(`/artwork/checkout/${id}`);
  };

  const handleAddToCart = () => {
    if (!artwork) return;
    
    addToCart('artwork', artwork);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 aspect-square bg-gray-200 rounded-md"></div>
            <div className="w-full md:w-1/2 space-y-4">
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

  if (!artwork) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Artwork Not Found</h2>
        <p className="mb-6">
          Sorry, we couldn't find the artwork you're looking for.
        </p>
        <Button asChild>
          <Link to="/artworks">Browse All Artworks</Link>
        </Button>
      </div>
    );
  }

  const inCart = isInCart(artwork.id);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-6">
        <Link to="/artworks" className="text-blue-600 hover:underline">
          ← Back to Artworks
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full md:w-1/2">
          <img
            src={createImageSrc(artwork.imageUrl || artwork.image_url)}
            alt={artwork.title}
            className="w-full rounded-lg shadow-lg object-cover aspect-square"
            onError={handleImageError}
          />
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
          <p className="text-xl text-gray-600 mb-4">By {artwork.artist}</p>
          
          <div className="bg-gray-100 rounded-md p-4 mb-4">
            <p className="text-2xl font-bold">{formatPrice(artwork.price)}</p>
            <p className="text-sm text-gray-500">
              {artwork.status === 'available' ? 'Available for purchase' : 'Already sold'}
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{artwork.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Dimensions</h3>
              <p>{artwork.dimensions || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Medium</h3>
              <p>{artwork.medium || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Year</h3>
              <p>{artwork.year || 'Not specified'}</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleBuyNow}
              className="w-full sm:w-auto"
              disabled={artwork.status !== 'available'}
            >
              Buy Now
            </Button>
            
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="w-full sm:w-auto"
              disabled={artwork.status !== 'available' || inCart}
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
        </div>
      </div>

      <Separator className="my-12" />

      <ArtworkRecommendations currentArtworkId={artwork.id} />
    </div>
  );
};

export default ArtworkDetail;
