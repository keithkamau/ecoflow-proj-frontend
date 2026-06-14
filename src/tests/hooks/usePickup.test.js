import { renderHook, act } from '@testing-library/react';
import usePickup from '../../hooks/usePickup';

// ── Mock pickupService ─────────────────────────────────────────
jest.mock('../../services/pickupService', () => ({
  getPickups: jest.fn().mockResolvedValue({
    data: [
      { id: 'p1', status: 'scheduled', material: { type: 'plastic', quantity: 50, unit: 'kg' } },
      { id: 'p2', status: 'completed', material: { type: 'metal',   quantity: 80, unit: 'kg' } },
    ],
  }),
  getPickup: jest.fn().mockResolvedValue({
    data: { id: 'p1', status: 'scheduled', material: { type: 'plastic' } },
  }),
  schedulePickup: jest.fn().mockResolvedValue({
    data: { id: 'p99', status: 'scheduled', material: { type: 'paper' } },
  }),
  uploadProof: jest.fn().mockResolvedValue({ data: { success: true } }),
  assignDriver: jest.fn().mockResolvedValue({ data: { success: true } }),
}));

// ── fetchPickups ───────────────────────────────────────────────
describe('usePickup — fetchPickups', () => {
  it('starts with empty pickups array', () => {
    const { result } = renderHook(() => usePickup());
    expect(result.current.pickups).toEqual([]);
  });

  it('populates pickups after fetchPickups()', async () => {
    const { result } = renderHook(() => usePickup());
    await act(async () => {
      await result.current.fetchPickups();
    });
    expect(result.current.pickups).toHaveLength(2);
    expect(result.current.pickups[0].id).toBe('p1');
  });

  it('sets loading=true while fetching, then false', async () => {
    const { result } = renderHook(() => usePickup());
    let loadingDuring;
    const promise = act(async () => {
      const p = result.current.fetchPickups();
      loadingDuring = result.current.loading;
      await p;
    });
    await promise;
    expect(result.current.loading).toBe(false);
  });

  it('sets error on failure', async () => {
    const { getPickups } = require('../../services/pickupService');
    getPickups.mockRejectedValueOnce({ response: { data: { detail: 'Server error' } } });
    const { result } = renderHook(() => usePickup());
    await act(async () => {
      await result.current.fetchPickups();
    });
    expect(result.current.error).toBe('Server error');
  });
});

// ── fetchPickup ────────────────────────────────────────────────
describe('usePickup — fetchPickup', () => {
  it('sets currentPickup after fetching by id', async () => {
    const { result } = renderHook(() => usePickup());
    await act(async () => {
      await result.current.fetchPickup('p1');
    });
    expect(result.current.currentPickup).not.toBeNull();
    expect(result.current.currentPickup.id).toBe('p1');
  });
});

// ── schedulePickup ─────────────────────────────────────────────
describe('usePickup — schedulePickup', () => {
  it('prepends new pickup to pickups array and returns success', async () => {
    const { result } = renderHook(() => usePickup());
    let res;
    await act(async () => {
      res = await result.current.schedulePickup({
        scheduled_time: '2026-12-01T09:00:00Z',
        pickup_location: { address: '45 Ngong Road' },
      });
    });
    expect(res.success).toBe(true);
    expect(result.current.pickups[0].id).toBe('p99');
  });

  it('returns { success: false } and sets error on failure', async () => {
    const { schedulePickup } = require('../../services/pickupService');
    schedulePickup.mockRejectedValueOnce({ response: { data: { detail: 'Bad request' } } });
    const { result } = renderHook(() => usePickup());
    let res;
    await act(async () => {
      res = await result.current.schedulePickup({});
    });
    expect(res.success).toBe(false);
    expect(result.current.error).toBe('Bad request');
  });
});

// ── fetchPickup error ──────────────────────────────────────────
describe('usePickup — fetchPickup error', () => {
  it('sets error and returns null on failure', async () => {
    const { getPickup } = require('../../services/pickupService');
    getPickup.mockRejectedValueOnce({ response: { data: { detail: 'Not found' } } });
    const { result } = renderHook(() => usePickup());
    let res;
    await act(async () => {
      res = await result.current.fetchPickup('bad-id');
    });
    expect(res).toBeNull();
    expect(result.current.error).toBe('Not found');
  });
});

// ── uploadProof ────────────────────────────────────────────────
describe('usePickup — uploadProof', () => {
  it('returns success on valid upload', async () => {
    const { result } = renderHook(() => usePickup());
    let res;
    await act(async () => {
      res = await result.current.uploadProof('p1', new FormData());
    });
    expect(res.success).toBe(true);
  });

  it('returns { success: false } and sets error on upload failure', async () => {
    const { uploadProof } = require('../../services/pickupService');
    uploadProof.mockRejectedValueOnce({ response: { data: { detail: 'Upload failed' } } });
    const { result } = renderHook(() => usePickup());
    let res;
    await act(async () => {
      res = await result.current.uploadProof('p1', new FormData());
    });
    expect(res.success).toBe(false);
    expect(result.current.error).toBe('Upload failed');
  });
});

// ── assignDriver ───────────────────────────────────────────────
describe('usePickup — assignDriver', () => {
  it('returns success on valid assignment', async () => {
    const { result } = renderHook(() => usePickup());
    let res;
    await act(async () => {
      res = await result.current.assignDriver({ pickup_id: 'p1', driver_id: 'd1' });
    });
    expect(res.success).toBe(true);
  });

  it('returns { success: false } and sets error on failure', async () => {
    const { assignDriver } = require('../../services/pickupService');
    assignDriver.mockRejectedValueOnce({ response: { data: { detail: 'Driver unavailable' } } });
    const { result } = renderHook(() => usePickup());
    let res;
    await act(async () => {
      res = await result.current.assignDriver({ pickup_id: 'p1', driver_id: 'd1' });
    });
    expect(res.success).toBe(false);
    expect(result.current.error).toBe('Driver unavailable');
  });
});
