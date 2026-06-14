import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

import listingService from '../../services/listingService';
import api from '../../services/api';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('listingService', () => {
  it('getMaterials calls api.get', async () => {
    api.get.mockResolvedValue({ data: [] });
    await listingService.getMaterials();
    expect(api.get).toHaveBeenCalledWith('/listings/materials');
  });

  it('createMaterial calls api.post', async () => {
    const data = { type: 'plastic' };
    api.post.mockResolvedValue({ data });
    await listingService.createMaterial(data);
    expect(api.post).toHaveBeenCalledWith('/listings/materials', data);
  });

  it('getListings calls api.get with params', async () => {
    api.get.mockResolvedValue({ data: { listings: [] } });
    await listingService.getListings({ status: 'active' });
    expect(api.get).toHaveBeenCalledWith('/listings/listings', { params: { status: 'active' } });
  });

  it('searchListings calls api.get', async () => {
    api.get.mockResolvedValue({ data: { listings: [] } });
    await listingService.searchListings({ material_type: 'plastic' });
    expect(api.get).toHaveBeenCalledWith('/listings/listings/search', { params: { material_type: 'plastic' } });
  });

  it('getListing calls api.get with id', async () => {
    api.get.mockResolvedValue({ data: {} });
    await listingService.getListing(1);
    expect(api.get).toHaveBeenCalledWith('/listings/listings/1');
  });

  it('createListing calls api.post', async () => {
    const data = { material_id: 1, quantity: 50 };
    api.post.mockResolvedValue({ data });
    await listingService.createListing(data);
    expect(api.post).toHaveBeenCalledWith('/listings/listings', data);
  });

  it('updateListing calls api.put', async () => {
    const data = { quantity: 100 };
    api.put.mockResolvedValue({ data });
    await listingService.updateListing(1, data);
    expect(api.put).toHaveBeenCalledWith('/listings/listings/1', data);
  });

  it('deleteListing calls api.delete', async () => {
    api.delete.mockResolvedValue({ data: {} });
    await listingService.deleteListing(1);
    expect(api.delete).toHaveBeenCalledWith('/listings/listings/1');
  });

  it('getRecyclerInventory calls api.get with recycler_id', async () => {
    api.get.mockResolvedValue({ data: { recycler_id: 1, items: [] } });
    await listingService.getRecyclerInventory(1);
    expect(api.get).toHaveBeenCalledWith('/listings/recyclers/inventory', {
      params: { recycler_id: 1 }
    });
  });
});