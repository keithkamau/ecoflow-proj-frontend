import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare } from "lucide-react";
import { messageService } from "../../services/messageService";
import { timeAgo } from "../../utils/formatters";

export default function Chat({ offerId, currentUserId = 1 }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!offerId) return;
    setLoading(true);
    messageService
      .getByOffer(offerId)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [offerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages]);

  function handleTyping(e) {
    setText(e.target.value);
    setTyping(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setTyping(false), 1000);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = await messageService.send({
      recipient_id: currentUserId === 1 ? 2 : 1,
      offer_id: offerId,
      message_text: text.trim(),
    });
    setMessages((prev) => [...prev, msg]);
    setText("");
  }

  if (!offerId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
        <MessageSquare size={32} />
        <p className="mt-2 text-sm">Select an offer to view messages</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
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
          onChange={handleTyping}
          className="input flex-1"
          placeholder="Type a message..."
        />
        <button type="submit" className="btn btn-primary btn-sm" disabled={!text.trim()}>
          <Send size={16} />
        </button>
      </form>

      {typing && text.length > 0 && (
        <p className="text-xs text-neutral-400 px-3 pb-2 italic animate-pulse">
          typing...
        </p>
      )}
    </div>
  );
}
