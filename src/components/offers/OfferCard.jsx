import { Tag, Clock, User, DollarSign } from "lucide-react";
import { formatCurrency, formatDateTime, statusBadgeClass, statusLabel } from "../../utils/formatters";

export default function OfferCard({ offer, onAccept, onReject, onMessage, isSeller }) {
  return (
    <div className="card card-hover animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`badge ${statusBadgeClass(offer.status)}`}>
              {statusLabel(offer.status)}
            </span>
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Clock size={12} />
              {formatDateTime(offer.created_at)}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-neutral-900 mb-1">
            {formatCurrency(offer.offered_price)} / unit
          </h3>

          <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
            <span className="flex items-center gap-1">
              <DollarSign size={14} />
              Qty: {offer.quantity}
            </span>
            <span className="flex items-center gap-1">
              <User size={14} />
              Recycler #{offer.recycler_id}
            </span>
          </div>

          {offer.note && (
            <p className="text-sm text-neutral-600 bg-neutral-50 rounded-md p-2 mb-3">
              {offer.note}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {isSeller && offer.status === "pending" && (
              <>
                <button className="btn btn-primary btn-sm" onClick={() => onAccept?.(offer.id)}>
                  Accept
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => onReject?.(offer.id)}>
                  Reject
                </button>
              </>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => onMessage?.(offer)}>
              <Tag size={14} />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
