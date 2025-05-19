
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Exhibition } from '@/types';
import { format } from 'date-fns';
import { createImageSrc, handleImageError } from '@/utils/imageUtils';
import { formatPrice, formatDateRange } from '@/utils/formatters';

interface ExhibitionDetailsProps {
  exhibition: Exhibition | null;
  isOpen?: boolean;
  onClose?: () => void;
}

const ExhibitionDetails: React.FC<ExhibitionDetailsProps> = ({ 
  exhibition, 
  isOpen = false, 
  onClose = () => {} 
}) => {
  const [dialogOpen, setDialogOpen] = useState(isOpen);

  const handleClose = () => {
    setDialogOpen(false);
    onClose();
  };

  if (!exhibition) return null;

  // If used in a dialog context (with isOpen and onClose props)
  if (isOpen !== undefined) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{exhibition.title}</DialogTitle>
          </DialogHeader>
          <ExhibitionDetailsContent exhibition={exhibition} />
        </DialogContent>
      </Dialog>
    );
  }

  // If used directly in a page (without dialog props)
  return <ExhibitionDetailsContent exhibition={exhibition} />;
};

// Separate the content to avoid duplication
const ExhibitionDetailsContent: React.FC<{ exhibition: Exhibition }> = ({ exhibition }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div>
        <img 
          src={exhibition.imageUrl ? createImageSrc(exhibition.imageUrl) : '/placeholder.svg'} 
          alt={exhibition.title}
          className="w-full h-64 object-cover rounded-lg shadow-md"
          onError={handleImageError}
        />
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Description</h3>
          <p className="text-gray-600">{exhibition.description}</p>
        </div>
        <div>
          <h3 className="font-semibold">Location</h3>
          <p className="text-gray-600">{exhibition.location}</p>
        </div>
        <div>
          <h3 className="font-semibold">Dates</h3>
          <p className="text-gray-600">
            {formatDateRange(exhibition.startDate, exhibition.endDate)}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Ticket Price</h3>
          <p className="text-gray-600">{formatPrice(exhibition.ticketPrice)}</p>
        </div>
        <div>
          <h3 className="font-semibold">Available Slots</h3>
          <p className="text-gray-600">{exhibition.availableSlots} / {exhibition.totalSlots}</p>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionDetails;
