// src/context/ListingContexts.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import listingService from '../services/listingService';

const ListingContext = createContext(null);

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
      setMaterials(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchListings = useCallback(async (filters = {}) => {
    setLoading(true);
    clearError();
    try {
      const response = await listingService.getListings(filters);
      setListings(response.data.listings || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchListing = useCallback(async (id) => {
    setLoading(true);
    clearError();
    try {
      const response = await listingService.getListing(id);
      setCurrentListing(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load listing');
    } finally {
      setLoading(false);
    }
  }, []);

  const createListing = useCallback(async (data) => {
    setLoading(true);
    clearError();
    try {
      const response = await listingService.createListing(data);
      setListings((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create listing');
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
        prev.map((item) => (item.id === id ? response.data : item))
      );
      if (currentListing?.id === id) setCurrentListing(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update listing');
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
      setError(err.response?.data?.detail || 'Failed to delete listing');
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
      setInventory(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load inventory');
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

export const useListingContext = () => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error('useListingContext must be used within a ListingProvider');
  }
  return context;
};

export default ListingContext;