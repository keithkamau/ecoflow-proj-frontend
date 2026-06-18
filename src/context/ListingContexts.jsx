// src/context/ListingContexts.jsx
import { useState, useCallback, useContext } from 'react';
import ListingContext from './ListingContext';
import listingService from '../services/listingService';

export const useListingContext = () => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error('useListingContext must be used within a ListingProvider');
  }
  return context;
};

export const ListingProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [currentListing, setCurrentListing] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const response = await listingService.getMaterials();
      setMaterials(response);
    } catch (err) {
      setError(err.message || 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchListings = useCallback(async (filters = {}) => {
    setLoading(true);
    clearError();
    try {
      const response = await listingService.getListings(filters);
      setListings(response.listings || []);
    } catch (err) {
      setError(err.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchListing = useCallback(async (id) => {
    setLoading(true);
    clearError();
    try {
      const response = await listingService.getListing(id);
      setCurrentListing(response);
    } catch (err) {
      setError(err.message || 'Failed to load listing');
    } finally {
      setLoading(false);
    }
  }, []);

  const createListing = useCallback(async (data) => {
    setLoading(true);
    clearError();
    try {
      const response = await listingService.createListing(data);
      setListings((prev) => [response, ...prev]);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create listing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateListing = useCallback(async (id, data) => {
    setLoading(true);
    clearError();
    try {
      const response = await listingService.updateListing(id, data);
      setListings((prev) =>
        prev.map((item) => (item.id === id ? response : item))
      );
      if (currentListing?.id === id) setCurrentListing(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update listing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentListing]);

  const deleteListing = useCallback(async (id) => {
    setLoading(true);
    clearError();
    try {
      await listingService.deleteListing(id);
      setListings((prev) => prev.filter((item) => item.id !== id));
      if (currentListing?.id === id) setCurrentListing(null);
    } catch (err) {
      setError(err.message || 'Failed to delete listing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentListing]);

  const fetchInventory = useCallback(async (recyclerId) => {
    setLoading(true);
    clearError();
    try {
      const response = await listingService.getRecyclerInventory(recyclerId);
      setInventory(response);
    } catch (err) {
      setError(err.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    listings,
    currentListing,
    materials,
    inventory,
    loading,
    error,
    clearError,
    fetchMaterials,
    fetchListings,
    fetchListing,
    createListing,
    updateListing,
    deleteListing,
    fetchInventory,
  };

  return (
    <ListingContext.Provider value={value}>
      {children}
    </ListingContext.Provider>
  );
};
