
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtistArtworks, deleteArtwork } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import ArtistLayout from '@/components/ArtistLayout';
import ArtworkTable from '@/components/ArtworkTable';
import { Button } from '@/components/ui/button';
import { Artwork } from '@/types';
import { Loader2, PlusCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ArtistArtworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [artworkToDelete, setArtworkToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const response = await getArtistArtworks();
      setArtworks(response.artworks || []);
    } catch (error) {
      console.error('Failed to fetch artworks:', error);
      toast({
        title: "Error",
        description: "Failed to load artworks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, [toast]);

  const handleAddArtwork = () => {
    navigate('/artist/add-artwork');
  };

  const handleEditArtwork = (artwork: Artwork) => {
    navigate(`/artist/edit-artwork/${artwork.id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!artworkToDelete) return;
    
    try {
      await deleteArtwork(artworkToDelete);
      toast({
        title: "Success",
        description: "Artwork deleted successfully.",
      });
      fetchArtworks();
    } catch (error) {
      console.error('Failed to delete artwork:', error);
      toast({
        title: "Error",
        description: "Failed to delete artwork. Please try again.",
        variant: "destructive",
      });
    } finally {
      setArtworkToDelete(null);
    }
  };

  const handleDeleteDialog = (id: string) => {
    setArtworkToDelete(id);
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Artworks</h1>
          <Button onClick={handleAddArtwork}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Artwork
          </Button>
        </div>

        {artworks.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">You haven't added any artworks yet.</p>
            <Button onClick={handleAddArtwork}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Artwork
            </Button>
          </div>
        ) : (
          <ArtworkTable 
            artworks={artworks} 
            onEdit={handleEditArtwork} 
            onDelete={handleDeleteDialog} 
          />
        )}

        <AlertDialog open={!!artworkToDelete} onOpenChange={() => setArtworkToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your artwork from our system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ArtistLayout>
  );
};

export default ArtistArtworks;
