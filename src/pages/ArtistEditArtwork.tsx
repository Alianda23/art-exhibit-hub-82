
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtwork, updateArtwork } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import ArtistLayout from '@/components/ArtistLayout';
import ArtworkForm from '@/components/ArtworkForm';
import { Loader2 } from 'lucide-react';

const ArtistEditArtwork = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [artwork, setArtwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return;
      
      try {
        const response = await getArtwork(id);
        setArtwork(response.artwork);
      } catch (error) {
        console.error('Error fetching artwork:', error);
        toast({
          title: "Error",
          description: "Failed to fetch artwork details. Please try again.",
          variant: "destructive",
        });
        navigate('/artist/artworks');
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id, navigate, toast]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    
    try {
      await updateArtwork(id, data);
      toast({
        title: "Success",
        description: "Artwork updated successfully.",
      });
      navigate('/artist/artworks');
    } catch (error) {
      console.error('Error updating artwork:', error);
      toast({
        title: "Error",
        description: "Failed to update artwork. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/artist/artworks');
  };

  if (loading) {
    return (
      <ArtistLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ArtistLayout>
    );
  }

  return (
    <ArtistLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit Artwork</h1>
        
        {artwork ? (
          <ArtworkForm
            initialData={artwork}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500">Artwork not found.</p>
          </div>
        )}
      </div>
    </ArtistLayout>
  );
};

export default ArtistEditArtwork;
