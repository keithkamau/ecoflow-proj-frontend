import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../services/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}));

import { messageService } from "../../services/messageService";
import { api } from "../../services/api";

beforeEach(() => vi.clearAllMocks());

describe("messageService", () => {
  it("getByOffer calls api.get with offer id", async () => {
    api.get.mockResolvedValue({ data: [] });
    await messageService.getByOffer(1);
    expect(api.get).toHaveBeenCalledWith("/messages/1");
  });

  it("send calls api.post", async () => {
    const data = { recipient_id: "abc", offer_id: 1, message_text: "hello" };
    api.post.mockResolvedValue({ data });
    await messageService.send(data);
    expect(api.post).toHaveBeenCalledWith("/messages/", data);
  });

  it("markAsRead calls api.put", async () => {
    api.put.mockResolvedValue({ data: { is_read: true } });
    await messageService.markAsRead(5);
    expect(api.put).toHaveBeenCalledWith("/messages/5/read");
  });

  it("getUnreadCount calls api.get", async () => {
    api.get.mockResolvedValue({ count: 3 });
    const res = await messageService.getUnreadCount();
    expect(api.get).toHaveBeenCalledWith("/messages/unread/count");
    expect(res.count).toBe(3);
  });
});
