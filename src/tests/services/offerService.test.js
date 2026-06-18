import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../services/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { offerService } from "../../services/offerService";
import { api } from "../../services/api";

beforeEach(() => vi.clearAllMocks());

describe("offerService", () => {
  it("getAll calls api.get with params", async () => {
    api.get.mockResolvedValue({ data: [] });
    await offerService.getAll({ listing_id: 1 });
    expect(api.get).toHaveBeenCalledWith("/offers/?listing_id=1");
  });

  it("getAll without params calls api.get with empty query", async () => {
    api.get.mockResolvedValue({ data: [] });
    await offerService.getAll();
    expect(api.get).toHaveBeenCalledWith("/offers/");
  });

  it("getById calls api.get with id", async () => {
    api.get.mockResolvedValue({ data: {} });
    await offerService.getById(1);
    expect(api.get).toHaveBeenCalledWith("/offers/1");
  });

  it("create calls api.post", async () => {
    const data = { listing_id: 1, offered_price: 100 };
    api.post.mockResolvedValue({ data });
    await offerService.create(data);
    expect(api.post).toHaveBeenCalledWith("/offers/", data);
  });

  it("update calls api.put", async () => {
    const data = { offered_price: 120 };
    api.put.mockResolvedValue({ data });
    await offerService.update(1, data);
    expect(api.put).toHaveBeenCalledWith("/offers/1", data);
  });

  it("delete calls api.delete", async () => {
    api.delete.mockResolvedValue({ data: {} });
    await offerService.delete(1);
    expect(api.delete).toHaveBeenCalledWith("/offers/1");
  });
});
