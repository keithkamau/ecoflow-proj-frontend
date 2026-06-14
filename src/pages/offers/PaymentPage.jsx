import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CreditCard, CheckCircle, Smartphone } from "lucide-react";
import { paymentService } from "../../services/paymentService";
import PaymentSelector from "../../components/offers/PaymentSelector";
import { formatCurrency } from "../../utils/formatters";

function WaitingScreen({ payment, phone, onSuccess, onError, onCancel }) {
  return (
    <div className="page-content max-w-md mx-auto">
      <div className="card text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning-light mb-4">
          <Smartphone size={32} className="text-warning" />
        </div>
        <h1 className="text-xl font-bold text-neutral-900 mb-2">Check Your Phone</h1>
        <p className="text-sm text-neutral-500 mb-2">
          M-Pesa PIN prompt sent to <strong>{phone}</strong>
        </p>
        <p className="text-xs text-neutral-400 mb-4">
          Enter your M-Pesa PIN to complete the payment
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-xs text-blue-700 text-left">
          <strong>Sandbox Notice:</strong> The live M-Pesa prompt requires a public server with a real domain.
          In this demo, click <strong>"I've Paid"</strong> after checking your M-Pesa to confirm.
        </div>

        <div className="flex gap-3">
          <button className="btn btn-primary flex-1" onClick={async () => {
            try {
              const receipt = `MANUAL-${Date.now()}`;
              const confirmed = await paymentService.confirm(payment.id, receipt);
              onSuccess(confirmed);
            } catch {
              onError("Failed to confirm payment. Try again.");
            }
          }}>
            I've Paid
          </button>
          <button className="btn btn-tertiary flex-1" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(searchParams.get("success") ? "success" : "select");
  const [transactionId, setTransactionId] = useState(searchParams.get("transaction_id") || "");
  const [amount, setAmount] = useState(searchParams.get("amount") || "");
  const [method, setMethod] = useState("mpesa");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);

  async function handlePay() {
    if (!transactionId || !amount) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await paymentService.create({
        transaction_id: Number(transactionId),
        user_id: 1,
        amount: Number(amount),
        payment_method: method,
        phone_number: phone,
      });
      setPayment(result);

      if (result.status === "pending") {
        setStep("waiting");
      } else {
        setStep("success");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "success" && payment) {
    return (
      <div className="page-content max-w-md mx-auto">
        <div className="card text-center py-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-light mb-4">
            <CheckCircle size={32} className="text-success" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">Payment Successful!</h1>
          <p className="text-sm text-neutral-500 mb-6">Transaction completed</p>

          <div className="bg-neutral-50 rounded-lg p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Reference</span>
              <span className="font-mono font-medium">{payment.reference || payment.mpesa_receipt || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Amount</span>
              <span className="font-medium">{formatCurrency(payment.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Commission</span>
              <span className="font-medium">{formatCurrency(payment.commission_amount)}</span>
            </div>
          </div>

          <button className="btn btn-primary w-full" onClick={() => navigate("/transactions")}>
            View Transactions
          </button>
        </div>
      </div>
    );
  }

  if (step === "waiting") {
    return <WaitingScreen
      payment={payment}
      phone={phone}
      onSuccess={(p) => { setPayment(p); setStep("success"); }}
      onError={setError}
      onCancel={() => setStep("select")}
    />;
  }

  return (
    <div className="page-content max-w-md mx-auto">
      <div className="card animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-primary-light text-primary">
            <CreditCard size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900">Make Payment</h1>
            <p className="text-sm text-neutral-500">Complete your transaction via M-Pesa</p>
          </div>
        </div>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="label">Transaction ID</label>
            <input
              type="number"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="input"
              placeholder="e.g. 1"
              readOnly={!!searchParams.get("transaction_id")}
            />
          </div>

          <div>
            <label className="label">Amount (KES)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              placeholder="e.g. 750.00"
              readOnly={!!searchParams.get("amount")}
            />
          </div>

          <PaymentSelector value={method} onChange={setMethod} />

          <div>
            <label className="label">Phone Number (M-Pesa)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input"
              placeholder="e.g. 254712345678"
            />
          </div>

          <button
            className="btn btn-primary w-full"
            onClick={handlePay}
            disabled={submitting || !transactionId || !amount || !phone}
          >
            {submitting ? "Processing..." : `Pay ${amount ? formatCurrency(amount) : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
