import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chat from "../../components/offers/Chat";

class MockWebSocket {
  constructor(url) { this.url = url; this.readyState = 0; }
  send = vi.fn();
  close = vi.fn();
  triggerOpen() { this.readyState = 1; this.onopen?.(); }
  triggerMessage(data) { this.onmessage?.({ data: JSON.stringify(data) }); }
  triggerClose() { this.onclose?.(); }
}

let mockWs;

vi.mock("../../services/api", () => ({
  getWsBaseUrl: () => "ws://127.0.0.1:8000",
}));

vi.mock("../../services/messageService", () => ({
  messageService: {
    getByOffer: vi.fn(),
  },
}));

import { messageService } from "../../services/messageService";

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.setItem("access_token", "test-token");
  global.WebSocket = vi.fn(() => {
    mockWs = new MockWebSocket();
    setTimeout(() => mockWs.triggerOpen(), 0);
    return mockWs;
  });
  messageService.getByOffer.mockResolvedValue([
    { id: 1, sender_id: "me", message_text: "Hello", created_at: new Date().toISOString() },
  ]);
});

describe("Chat", () => {
  it("shows placeholder when no offerId", () => {
    render(<Chat />);
    expect(screen.getByText("Select an offer to view messages")).toBeInTheDocument();
  });

  it("loads message history on mount", async () => {
    render(<Chat offerId={1} currentUserId="me" recipientId="them" />);
    await waitFor(() => {
      expect(messageService.getByOffer).toHaveBeenCalledWith(1);
    });
    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
    });
  });

  it("sends message via WebSocket when connected", async () => {
    render(<Chat offerId={1} currentUserId="me" recipientId="them" />);
    await waitFor(() => expect(mockWs).toBeTruthy());

    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "Hi there" } });
    fireEvent.submit(screen.getByPlaceholderText("Type a message...").closest("form"));

    await waitFor(() => {
      expect(mockWs.send).toHaveBeenCalled();
      const sent = JSON.parse(mockWs.send.mock.calls[0][0]);
      expect(sent.action).toBe("message");
      expect(sent.message_text).toBe("Hi there");
    });
  });

  it("receives incoming WebSocket messages", async () => {
    render(<Chat offerId={1} currentUserId="me" recipientId="them" />);
    await waitFor(() => expect(mockWs).toBeTruthy());

    mockWs.triggerMessage({
      type: "new_message",
      id: 999,
      sender_id: "them",
      message_text: "Incoming reply",
      created_at: new Date().toISOString(),
    });

    await waitFor(() => {
      expect(screen.getByText("Incoming reply")).toBeInTheDocument();
    });
  });

  it("shows Live indicator when connected", async () => {
    render(<Chat offerId={1} currentUserId="me" recipientId="them" />);
    await waitFor(() => {
      expect(screen.getByText("Live")).toBeInTheDocument();
    });
  });

  it("shows Offline indicator on disconnect", async () => {
    render(<Chat offerId={1} currentUserId="me" recipientId="them" />);
    await waitFor(() => expect(mockWs).toBeTruthy());
    mockWs.triggerClose();
    await waitFor(() => {
      expect(screen.getByText("Offline")).toBeInTheDocument();
    });
  });
});
