import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from '@testing-library/react';
import useListing from '../../hooks/useListing';

vi.mock('../../services/listingService', () => {
  return {
    default: {
      getMaterials: vi.fn(),
      getListings: vi.fn(),
      getListing: vi.fn(),
      createListing: vi.fn(),
      updateListing: vi.fn(),
      deleteListing: vi.fn(),
      searchListings: vi.fn(),
      getRecyclerInventory: vi.fn(),
    }
  };
});

import listingService from '../../services/listingService';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useListing', () => {
  it('starts with empty state', () => {
    const { result } = renderHook(() => useListing());
    expect(result.current.listings).toEqual([]);
    expect(result.current.materials).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetches materials', async () => {
    listingService.getMaterials.mockResolvedValue({ data: [{ id: 1, type: 'plastic' }] });
    const { result } = renderHook(() => useListing());

    await act(async () => {
      await result.current.fetchMaterials();
    });

    expect(result.current.materials).toEqual([{ id: 1, type: 'plastic' }]);
  });

  it('fetches listings', async () => {
    listingService.getListings.mockResolvedValue({ data: { listings: [{ id: 1 }], total: 1 } });
    const { result } = renderHook(() => useListing());

    await act(async () => {
      await result.current.fetchListings();
    });

    expect(result.current.listings).toEqual([{ id: 1 }]);
  });

  it('creates listing', async () => {
    const newListing = { id: 1, quantity: 100, status: 'active' };
    listingService.createListing.mockResolvedValue({ data: newListing });
    const { result } = renderHook(() => useListing());

    await act(async () => {
      await result.current.createListing({ material_id: 1, quantity: 100 });
    });

    expect(result.current.listings).toContainEqual(newListing);
  });

  it('clears error', () => {
    const { result } = renderHook(() => useListing());
    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });
});