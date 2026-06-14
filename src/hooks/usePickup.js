import { useState, useCallback } from 'react';
import * as pickupService from '../services/pickupService';

const usePickup = () => {
  const [pickups, setPickups] = useState([]);
  const [currentPickup, setCurrentPickup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPickups = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await pickupService.getPickups(params);
      setPickups(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load pickups');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPickup = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await pickupService.getPickup(id);
      setCurrentPickup(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load pickup');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const schedulePickup = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await pickupService.schedulePickup(formData);
      setPickups((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to schedule pickup';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadProof = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await pickupService.uploadProof(id, formData);
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to upload proof';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const assignDriver = useCallback(async (assignmentData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await pickupService.assignDriver(assignmentData);
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to assign driver';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    pickups,
    currentPickup,
    loading,
    error,
    fetchPickups,
    fetchPickup,
    schedulePickup,
    uploadProof,
    assignDriver,
  };
};

export default usePickup;
