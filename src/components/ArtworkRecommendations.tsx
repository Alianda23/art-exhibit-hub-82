
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArtworkCard from '@/components/ArtworkCard';
import { getAllArtworks } from '@/services/api';
import { Artwork } from '@/types';
import { useToast } from '@/hooks/use-toast';

const ArtworkRecommendations = () => {
  const [recommendedArtworks, setRecommendedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAndGenerateRecommendations = async () => {
      try {
        setLoading(true);
        const allArtworks = await getAllArtworks();
        console.log("Fetched artworks for recommendations:", allArtworks.length);
        
        // Generate recommendations from all artworks
        const recommendations = generateRecommendations(allArtworks);
        setRecommendedArtworks(recommendations);
      } catch (error) {
        console.error('Failed to fetch artwork recommendations:', error);
        toast({
          title: "Error",
          description: "Failed to load artwork recommendations. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndGenerateRecommendations();
  }, [toast]);

  // Generate personalized recommendations
  const generateRecommendations = (artworks: Artwork[]): Artwork[] => {
    console.log("Generating recommendations");
    
    // For demonstration purposes, pick 3 random artworks as "recommendations"
    if (artworks.length <= 3) {
      return artworks;
    } else {
      // Shuffle array and pick first 3
      const shuffled = [...artworks].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    }
  };

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-gold" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              Featured <span className="text-gold">Recommendations</span>
            </h2>
          </div>
          <Link to="/artworks">
            <Button variant="ghost" className="text-gold hover:text-gold-dark flex items-center gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="artwork-grid">
          {loading ? (
            <p className="text-center w-full">Loading recommendations...</p>
          ) : recommendedArtworks.length > 0 ? (
            recommendedArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))
          ) : (
            <p className="text-center w-full">No recommendations found. Please check back later.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArtworkRecommendations;
