import { renderHook, act } from '@testing-library/react';
import usePickup from '../../hooks/usePickup';
import * as pickupService from '../../services/pickupService';

// ── Mock pickupService ─────────────────────────────────────────
vi.mock('../../services/pickupService', () => ({
  getPickups: vi.fn().mockResolvedValue({
    data: [
      { id: 'p1', status: 'scheduled', material: { type: 'plastic', quantity: 50, unit: 'kg' } },
      { id: 'p2', status: 'completed', material: { type: 'metal',   quantity: 80, unit: 'kg' } },
    ],
  }),
  getPickup: vi.fn().mockResolvedValue({
    data: { id: 'p1', status: 'scheduled', material: { type: 'plastic' } },
  }),
  schedulePickup: vi.fn().mockResolvedValue({
    data: { id: 'p99', status: 'scheduled', material: { type: 'paper' } },
  }),
  uploadProof: vi.fn().mockResolvedValue({ data: { success: true } }),
  assignDriver: vi.fn().mockResolvedValue({ data: { success: true } }),
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
    pickupService.getPickups.mockRejectedValueOnce(new Error('Server error'));
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
    pickupService.schedulePickup.mockRejectedValueOnce(new Error('Bad request'));
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
    pickupService.getPickup.mockRejectedValueOnce(new Error('Not found'));
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
    pickupService.uploadProof.mockRejectedValueOnce(new Error('Upload failed'));
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
    pickupService.assignDriver.mockRejectedValueOnce(new Error('Driver unavailable'));
    const { result } = renderHook(() => usePickup());
    let res;
    await act(async () => {
      res = await result.current.assignDriver({ pickup_id: 'p1', driver_id: 'd1' });
    });
    expect(res.success).toBe(false);
    expect(result.current.error).toBe('Driver unavailable');
  });
});
