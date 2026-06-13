import { Smartphone, CreditCard, Building2 } from "lucide-react";

const METHODS = [
  { value: "mpesa", label: "M-Pesa", icon: Smartphone, desc: "Pay via mobile money" },
  { value: "card", label: "Card", icon: CreditCard, desc: "Debit or credit card" },
  { value: "bank", label: "Bank Transfer", icon: Building2, desc: "Direct bank deposit" },
];

export default function PaymentSelector({ value, onChange }) {
  return (
    <div className="space-y-3">
      <label className="label">Payment Method</label>
      <div className="grid gap-3">
        {METHODS.map((method) => {
          const Icon = method.icon;
          const selected = value === method.value;
          return (
            <button
              key={method.value}
              type="button"
              onClick={() => onChange(method.value)}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                selected
                  ? "border-primary bg-primary-light"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <div className={`p-2 rounded-full ${selected ? "bg-primary text-white" : "bg-neutral-100 text-neutral-500"}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className={`font-medium text-sm ${selected ? "text-primary-darker" : "text-neutral-700"}`}>
                  {method.label}
                </p>
                <p className="text-xs text-neutral-500">{method.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
