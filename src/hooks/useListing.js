import { useState, useCallback } from 'react';
import listingService from '../services/listingService';

export const useListing = () => {
  const [listings, setListings] = useState([]);
  const [listing, setListing] = useState(null);
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
      setMaterials(Array.isArray(response) ? response : []);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch materials');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchListings = useCallback(async (filters = {}) => {
    setLoading(true);
    clearError();
    try {
      const response = await listingService.getListings(filters);
      setListings(response?.listings || []);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch listings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchListing = useCallback(async (id) => {
    setLoading(true);
    clearError();
    try {
      const response = await listingService.getListing(id);
      setListing(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch listing');
      throw err;
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
      if (listing?.id === id) setListing(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update listing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listing]);

  const deleteListing = useCallback(async (id) => {
    setLoading(true);
    clearError();
    try {
      await listingService.deleteListing(id);
      setListings((prev) => prev.filter((item) => item.id !== id));
      if (listing?.id === id) setListing(null);
    } catch (err) {
      setError(err.message || 'Failed to delete listing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listing]);

  const searchListings = useCallback(async (filters = {}) => {
    setLoading(true);
    clearError();
    try {
      const response = await listingService.searchListings(filters);
      setListings(response?.listings || []);
      return response;
    } catch (err) {
      setError(err.message || 'Search failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInventory = useCallback(async (recyclerId) => {
    setLoading(true);
    clearError();
    try {
      const response = await listingService.getRecyclerInventory(recyclerId);
      setInventory(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch inventory');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    listings,
    listing,
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
    searchListings,
    fetchInventory,
  };
};

export default useListing;
