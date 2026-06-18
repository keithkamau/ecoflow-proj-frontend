export function formatCurrency(amount) {
  const val = Number(amount);
  if (isNaN(val)) return "—";
  return `KES ${val.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-KE", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-KE", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const normalized = dateStr.endsWith("Z") || dateStr.includes("+") ? dateStr : dateStr + "Z";
  const then = new Date(normalized);
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export function statusLabel(status) {
  const labels = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    countered: "Countered",
    expired: "Expired",
    offer_accepted: "Offer Accepted",
    pickup_scheduled: "Pickup Scheduled",
    pickup_completed: "Pickup Completed",
    payment_pending: "Payment Pending",
    completed: "Completed",
    disputed: "Disputed",
    cancelled: "Cancelled",
    success: "Success",
    failed: "Failed",
    refunded: "Refunded",
  };
  return labels[status] || status;
}

export function statusBadgeClass(status) {
  const map = {
    pending: "badge-pending",
    accepted: "badge-active",
    completed: "badge-completed",
    success: "badge-completed",
    disputed: "badge-error",
    failed: "badge-error",
    cancelled: "badge-error",
    rejected: "badge-error",
    expired: "badge-neutral",
  };
  return map[status] || "badge-neutral";
}
