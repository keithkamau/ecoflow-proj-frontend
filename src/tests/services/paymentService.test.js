import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../services/api", () => ({
  api: { get: vi.fn(), post: vi.fn() },
}));

import { paymentService } from "../../services/paymentService";
import { api } from "../../services/api";

beforeEach(() => vi.clearAllMocks());

describe("paymentService", () => {
  it("getAll calls api.get", async () => {
    api.get.mockResolvedValue({ data: [] });
    await paymentService.getAll();
    expect(api.get).toHaveBeenCalledWith("/payments/");
  });

  it("getByTransaction calls api.get with id", async () => {
    api.get.mockResolvedValue({ data: {} });
    await paymentService.getByTransaction(1);
    expect(api.get).toHaveBeenCalledWith("/payments/1");
  });

  it("create calls api.post", async () => {
    const data = { transaction_id: 1, amount: 500 };
    api.post.mockResolvedValue({ data });
    await paymentService.create(data);
    expect(api.post).toHaveBeenCalledWith("/payments/", data);
  });

  it("getByPaymentId calls api.get with detail path", async () => {
    api.get.mockResolvedValue({ data: {} });
    await paymentService.getByPaymentId(1);
    expect(api.get).toHaveBeenCalledWith("/payments/detail/1");
  });

  it("confirm calls api.post with receipt query", async () => {
    api.post.mockResolvedValue({ data: { status: "success" } });
    await paymentService.confirm(1, "MPE123");
    expect(api.post).toHaveBeenCalledWith("/payments/1/confirm?mpesa_receipt=MPE123");
  });
});
