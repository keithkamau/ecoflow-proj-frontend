import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../services/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}));

import { transactionService } from "../../services/transactionService";
import { api } from "../../services/api";

beforeEach(() => vi.clearAllMocks());

describe("transactionService", () => {
  it("getAll calls api.get with params", async () => {
    api.get.mockResolvedValue({ data: [] });
    await transactionService.getAll({ seller_id: "abc" });
    expect(api.get).toHaveBeenCalledWith("/transactions/?seller_id=abc");
  });

  it("getAll without params calls api.get with empty query", async () => {
    api.get.mockResolvedValue({ data: [] });
    await transactionService.getAll();
    expect(api.get).toHaveBeenCalledWith("/transactions/");
  });

  it("getById calls api.get with id", async () => {
    api.get.mockResolvedValue({ data: {} });
    await transactionService.getById(1);
    expect(api.get).toHaveBeenCalledWith("/transactions/1");
  });

  it("create calls api.post", async () => {
    const data = { offer_id: 1, agreed_price: 500 };
    api.post.mockResolvedValue({ data });
    await transactionService.create(data);
    expect(api.post).toHaveBeenCalledWith("/transactions/", data);
  });

  it("update calls api.put", async () => {
    const data = { status: "completed" };
    api.put.mockResolvedValue({ data });
    await transactionService.update(1, data);
    expect(api.put).toHaveBeenCalledWith("/transactions/1", data);
  });
});
