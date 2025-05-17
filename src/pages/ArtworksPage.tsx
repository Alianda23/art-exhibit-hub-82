import React, { useState, useEffect } from 'react';
import ArtworkCard from '@/components/ArtworkCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { formatPrice } from '@/utils/formatters';
import { Search, Sparkles } from 'lucide-react';
import { getAllArtworks } from '@/services/api';
import { Artwork } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const ArtworksPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedArtworks, setRecommendedArtworks] = useState<Artwork[]>([]);
  const { toast } = useToast();
  
  // Get min and max prices from artwork data
  const minPrice = 0;
  const maxPrice = 100000;

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const data = await getAllArtworks();
        console.log("Artworks loaded successfully:", data.length);
        
        // Log image URLs for debugging
        data.forEach((artwork: Artwork) => {
          const imageSource = artwork.image_url || artwork.imageUrl;
          console.log(`Artwork ${artwork.id} (${artwork.title}) image source: ${imageSource}`);
        });
        
        setArtworks(data);
      } catch (error) {
        console.error('Failed to fetch artworks:', error);
        toast({
          title: "Error",
          description: "Failed to load artworks. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtworks();
  }, [toast]);

  // Generate AI recommendations
  const generateRecommendations = () => {
    if (artworks.length === 0) return;
    
    // Simulate AI recommendation logic
    // In a real implementation, this would call an AI service
    console.log("Generating AI recommendations based on user preferences");
    
    // For demonstration purposes, we'll consider the current search and price filters
    // and pick artworks that match those criteria as "personalized recommendations"
    let recommendations: Artwork[] = [];
    
    if (searchTerm.trim() !== '') {
      // If there's a search term, generate recommendations based on similar terms
      const relevantTerms = searchTerm.toLowerCase().split(' ');
      
      recommendations = artworks
        .filter(artwork => {
          return relevantTerms.some(term => 
            artwork.title.toLowerCase().includes(term) || 
            artwork.description.toLowerCase().includes(term) ||
            artwork.medium.toLowerCase().includes(term)
          );
        })
        .slice(0, 3);
    } else {
      // Otherwise pick some random ones in the price range
      recommendations = artworks
        .filter(artwork => artwork.price >= priceRange[0] && artwork.price <= priceRange[1])
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    }
    
    setRecommendedArtworks(recommendations);
    setShowRecommendations(true);
    
    toast({
      title: "AI Recommendations Generated",
      description: "Here are some artworks you might like based on your preferences.",
    });
  };

  // Filter artworks based on search term and price range
  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch = 
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = artwork.price >= priceRange[0] && artwork.price <= priceRange[1];
    
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="py-12 px-4 md:px-6 bg-secondary min-h-screen">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">
            Discover Our <span className="text-gold">Artwork</span> Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore and purchase unique artworks created by talented Kenyan artists
          </p>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <div className="grid md:grid-cols-[1fr_2fr] gap-6">
            <div>
              <Label htmlFor="price-range" className="text-lg font-medium mb-3 block">Price Range</Label>
              <div className="px-2">
                <Slider
                  id="price-range"
                  defaultValue={[minPrice, maxPrice]}
                  max={maxPrice}
                  min={minPrice}
                  step={1000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="my-4"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
            
            <div className="flex items-end">
              <div className="relative w-full">
                <Label htmlFor="search" className="text-lg font-medium mb-3 block">Search</Label>
                <div className="relative">
                  <Input
                    id="search"
                    placeholder="Search by title, artist, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Recommendations Button */}
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={generateRecommendations}
              className="bg-gold hover:bg-gold-dark text-white flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Get AI Recommendations
            </Button>
          </div>
        </div>
        
        {/* AI Recommendations Section */}
        {showRecommendations && (
          <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Sparkles className="h-5 w-5 text-gold mr-2" />
              <h2 className="text-2xl font-serif font-bold">AI Recommendations For You</h2>
            </div>
            
            {recommendedArtworks.length > 0 ? (
              <div className="artwork-grid">
                {recommendedArtworks.map((artwork) => (
                  <ArtworkCard key={`rec-${artwork.id}`} artwork={artwork} />
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-600">
                No recommendations found based on your current preferences.
                Try adjusting your search or price range.
              </p>
            )}
          </div>
        )}
        
        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? "Loading artworks..." : `Showing ${filteredArtworks.length} artworks`}
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-medium mb-2">Loading artworks...</h3>
            <p className="text-gray-600">Please wait while we fetch the artworks</p>
          </div>
        ) : filteredArtworks.length > 0 ? (
          <div className="artwork-grid">
            {filteredArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-medium mb-2">No artworks found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworksPage;
