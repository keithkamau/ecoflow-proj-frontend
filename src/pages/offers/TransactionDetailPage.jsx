import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowLeftRight, CreditCard, CheckCircle, Lock, Calendar, Truck } from "lucide-react";
import { transactionService } from "../../services/transactionService";
import { paymentService } from "../../services/paymentService";
import TransactionTimeline from "../../components/offers/TransactionTimeline";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { formatCurrency, formatDateTime, statusLabel } from "../../utils/formatters";
import { useAuth } from "../../hooks/useAuth";

export default function TransactionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tx, setTx] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const isRecycler = user?.id === tx?.recycler_id;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await transactionService.getById(id);
      setTx(data);
      try {
        const p = await paymentService.getByTransaction(id);
        setPayment(p);
      } catch {
        setPayment(null);
      }
    } catch {
      setTx(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await transactionService.update(id, { status: newStatus });
      fetch();
    } catch {
      alert("Failed to update transaction");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <PageLoader message="Loading transaction..." />;

  if (!tx) {
    return (
      <div className="page-content">
        <div className="card text-center py-12 text-neutral-400">
          <ArrowLeftRight size={40} className="mx-auto mb-3" />
          <p className="text-sm font-medium">Transaction not found</p>
          <button className="btn btn-ghost btn-sm mt-4" onClick={() => navigate("/transactions")}>
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content max-w-3xl mx-auto">
      <button className="btn btn-ghost btn-sm mb-4" onClick={() => navigate("/transactions")}>
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-4">
          <div className="card">
            <h1 className="text-xl font-bold text-neutral-900 mb-1">
              Transaction #{tx.id}
            </h1>
            <p className="text-sm text-neutral-500 mb-4">
              Created {formatDateTime(tx.created_at)}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-500">Agreed Price</span>
                <p className="font-semibold">{formatCurrency(tx.agreed_price)}</p>
              </div>
              <div>
                <span className="text-neutral-500">Quantity</span>
                <p className="font-semibold">{tx.final_quantity} kg</p>
              </div>
              <div>
                <span className="text-neutral-500">Total</span>
                <p className="font-semibold text-primary">{formatCurrency(tx.final_price)}</p>
              </div>
              <div>
                <span className="text-neutral-500">Completed</span>
                <p className="font-semibold">{tx.completed_at ? formatDateTime(tx.completed_at) : "—"}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200">
              {tx.status === "completed" ? (
                <div className="bg-success-light border border-success/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-success-dark font-medium mb-3">
                    <CheckCircle size={18} />
                    Transaction Completed
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-success-dark/70">Total Paid</span>
                    <span className="text-2xl font-bold text-success-dark">{formatCurrency(tx.final_price)}</span>
                  </div>
                </div>
              ) : tx.status === "cancelled" || tx.status === "disputed" ? (
                <div className="flex items-center gap-2 text-neutral-500 bg-neutral-100 rounded-lg p-3 text-sm font-medium">
                  <Lock size={16} />
                  Transaction {statusLabel(tx.status)} — Locked
                </div>
              ) : payment && payment.status === "success" ? (
                <div className="flex items-center gap-2 text-success-dark bg-success-light rounded-lg p-3 text-sm font-medium">
                  <CheckCircle size={18} />
                  Paid — Ref: {payment.mpesa_receipt || payment.reference || payment.id}
                </div>
              ) : isRecycler && tx.status === "offer_accepted" ? (
                <button
                  className="btn btn-primary w-full"
                  onClick={() => handleStatusUpdate("pickup_scheduled")}
                  disabled={updating}
                >
                  <Calendar size={16} />
                  {updating ? "Updating..." : "Schedule Pickup"}
                </button>
              ) : isRecycler && tx.status === "pickup_scheduled" ? (
                <button
                  className="btn btn-primary w-full"
                  onClick={() => handleStatusUpdate("pickup_completed")}
                  disabled={updating}
                >
                  <Truck size={16} />
                  {updating ? "Updating..." : "Confirm Collection"}
                </button>
              ) : (
                <button
                  className="btn btn-primary w-full"
                  onClick={() => navigate(`/payments?transaction_id=${tx.id}&amount=${tx.final_price}`)}
                >
                  <CreditCard size={16} />
                  Pay Now
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-sm font-semibold text-neutral-700 mb-4">Progress</h2>
            <TransactionTimeline currentStatus={tx.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
