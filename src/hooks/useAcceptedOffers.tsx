import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AcceptedOffer {
  productId: number;
  acceptedPrice: number;
  sellerName: string;
}

interface AcceptedOffersContextType {
  acceptedOffers: Record<number, AcceptedOffer>;
  addAcceptedOffer: (offer: AcceptedOffer) => void;
  getAcceptedPrice: (productId: number) => number | null;
  clearOffer: (productId: number) => void;
}

const AcceptedOffersContext = createContext<AcceptedOffersContextType | undefined>(undefined);

export function AcceptedOffersProvider({ children }: { children: ReactNode }) {
  const [acceptedOffers, setAcceptedOffers] = useState<Record<number, AcceptedOffer>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('mira-accepted-offers');
    if (stored) {
      try {
        setAcceptedOffers(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse accepted offers', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('mira-accepted-offers', JSON.stringify(acceptedOffers));
  }, [acceptedOffers]);

  const addAcceptedOffer = (offer: AcceptedOffer) => {
    setAcceptedOffers(prev => ({
      ...prev,
      [offer.productId]: offer,
    }));
  };

  const getAcceptedPrice = (productId: number): number | null => {
    return acceptedOffers[productId]?.acceptedPrice ?? null;
  };

  const clearOffer = (productId: number) => {
    setAcceptedOffers(prev => {
      const newOffers = { ...prev };
      delete newOffers[productId];
      return newOffers;
    });
  };

  return (
    <AcceptedOffersContext.Provider value={{ acceptedOffers, addAcceptedOffer, getAcceptedPrice, clearOffer }}>
      {children}
    </AcceptedOffersContext.Provider>
  );
}

export function useAcceptedOffers() {
  const context = useContext(AcceptedOffersContext);
  if (!context) {
    throw new Error('useAcceptedOffers must be used within AcceptedOffersProvider');
  }
  return context;
}
