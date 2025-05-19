
import React, { useEffect, useState } from 'react';
import ArtworkCard from './ArtworkCard';
import { Artwork } from '@/types';

interface ArtworkRecommendationsProps {
  currentArtworkId: string;
}

const ArtworkRecommendations: React.FC<ArtworkRecommendationsProps> = ({ currentArtworkId }) => {
  const [recommendations, setRecommendations] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`http://localhost:8000/artworks/recommendations?exclude=${currentArtworkId}`);
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.slice(0, 4)); // Take max 4 recommendations
        }
      } catch (error) {
        console.error('Error fetching artwork recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentArtworkId]);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map(artwork => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  );
};

export default ArtworkRecommendations;
