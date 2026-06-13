import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, ArrowLeftRight, ExternalLink } from "lucide-react";
import { transactionService } from "../../services/transactionService";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { formatCurrency, formatDateTime, statusBadgeClass, statusLabel } from "../../utils/formatters";

export default function TransactionPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionService.getAll();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  if (loading && !transactions.length) return <PageLoader message="Loading transactions..." />;

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Transactions</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {transactions.filter((t) => t.status === "completed").length} completed &middot;{" "}
            {transactions.length} total
          </p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetch} disabled={loading}>
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      {transactions.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-12 text-neutral-400">
          <ArrowLeftRight size={40} />
          <p className="mt-3 text-sm font-medium">No transactions yet</p>
          <p className="text-xs mt-1">Transactions appear when an offer is accepted</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 text-left">
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Agreed Price</th>
                <th className="px-4 py-3 font-semibold">Qty</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-neutral-50 transition-colors cursor-pointer group" onClick={() => navigate(`/transactions/${tx.id}`)}>
                  <td className="px-4 py-3 font-mono text-xs flex items-center gap-2">
                    #{tx.id}
                    <ExternalLink size={12} className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${statusBadgeClass(tx.status)}`}>
                      {statusLabel(tx.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatCurrency(tx.agreed_price)}</td>
                  <td className="px-4 py-3">{tx.final_quantity} kg</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(tx.final_price)}</td>
                  <td className="px-4 py-3 text-neutral-500">{formatDateTime(tx.created_at)}</td>
                  <td className="px-4 py-3 text-neutral-500">{formatDateTime(tx.completed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
