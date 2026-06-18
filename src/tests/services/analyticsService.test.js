import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../services/api", () => ({
  default: { get: vi.fn() },
}));

import { getImpact, getEarningsTrend, getSellerStats, getRecyclerStats, getMaterialsBreakdown } from "../../services/analyticsService";
import api from "../../services/api";

beforeEach(() => vi.clearAllMocks());

describe("analyticsService", () => {
  it("getImpact calls api.get", async () => {
    api.get.mockResolvedValue({ data: { total_earnings: 1000 } });
    await getImpact();
    expect(api.get).toHaveBeenCalledWith("/analytics/impact");
  });

  it("getEarningsTrend calls api.get", async () => {
    api.get.mockResolvedValue({ data: [] });
    await getEarningsTrend();
    expect(api.get).toHaveBeenCalledWith("/analytics/earnings-trend");
  });

  it("getSellerStats calls api.get", async () => {
    api.get.mockResolvedValue({ data: {} });
    await getSellerStats();
    expect(api.get).toHaveBeenCalledWith("/analytics/seller-stats");
  });

  it("getRecyclerStats calls api.get", async () => {
    api.get.mockResolvedValue({ data: {} });
    await getRecyclerStats();
    expect(api.get).toHaveBeenCalledWith("/analytics/recycler-stats");
  });

  it("getMaterialsBreakdown returns empty array", async () => {
    const res = await getMaterialsBreakdown();
    expect(res).toEqual([]);
  });
});
