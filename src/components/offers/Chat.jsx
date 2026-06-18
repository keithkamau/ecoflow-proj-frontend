import { useState, useEffect, useRef, useCallback } from "react";
import { Send, MessageSquare, Wifi, WifiOff } from "lucide-react";
import { messageService } from "../../services/messageService";
import { getWsBaseUrl } from "../../services/api";
import { timeAgo } from "../../utils/formatters";

export default function Chat({ offerId, recipientId, currentUserId, offer }) {
  const offerIdentifier = offerId || offer?.id;
  const to = recipientId || offer?.recycler_id;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const bottomRef = useRef(null);

  const loadHistory = useCallback(() => {
    if (!offerIdentifier) return;
    setLoading(true);
    messageService
      .getByOffer(offerIdentifier)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [offerIdentifier]);

  useEffect(() => {
    if (!offerIdentifier) return;
    const token = localStorage.getItem("access_token");
    if (!token) { loadHistory(); return; }

    const wsUrl = `${getWsBaseUrl()}/ws/chat/${offerIdentifier}?token=${token}`;
    let reconnectTimer = null;

    function connect() {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "new_message") {
            setMessages((prev) => {
              if (prev.some((m) => m.id === data.id)) return prev;
              return [...prev, data];
            });
          }
        } catch {}
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (wsRef.current) wsRef.current.close();
    };
  }, [offerIdentifier, loadHistory]);

  useEffect(() => {
    if (!offerIdentifier) return;
    loadHistory();
  }, [offerIdentifier, loadHistory]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e) {
    e.preventDefault();
    if (!text.trim() || !to) return;

    const payload = {
      action: "message",
      recipient_id: to,
      message_text: text.trim(),
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
      setText("");
    } else {
      messageService.send(payload).then((msg) => {
        setMessages((prev) => [...prev, msg]);
        setText("");
      }).catch(() => {});
    }
  }

  if (!offerIdentifier) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
        <MessageSquare size={32} />
        <p className="mt-2 text-sm">Select an offer to view messages</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 bg-neutral-50">
        <span className="text-xs font-medium text-neutral-500">Chat</span>
        {connected ? (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <Wifi size={12} /> Live
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <WifiOff size={12} /> Offline
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-12 w-3/4 rounded-lg" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-neutral-400 py-8">
            No messages yet. Start the conversation.
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    isMine
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-neutral-100 text-neutral-900 rounded-bl-sm"
                  }`}
                >
                  <p>{msg.message_text}</p>
                  <p className={`text-xs mt-1 ${isMine ? "text-white/70" : "text-neutral-400"}`}>
                    {timeAgo(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-neutral-200 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input flex-1"
          placeholder="Type a message..."
        />
        <button type="submit" className="btn btn-primary btn-sm" disabled={!text.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
