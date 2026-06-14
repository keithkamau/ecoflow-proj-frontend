import { Check, Clock, Truck, CreditCard, Package } from "lucide-react";

const STEPS = [
  { status: "offer_accepted", label: "Offer Accepted", icon: Check, desc: "Seller accepted your offer" },
  { status: "pickup_scheduled", label: "Pickup Scheduled", icon: Clock, desc: "Pickup time confirmed" },
  { status: "pickup_completed", label: "Picked Up", icon: Truck, desc: "Waste collected from seller" },
  { status: "payment_pending", label: "Payment Pending", icon: Package, desc: "Verifying pickup details" },
  { status: "completed", label: "Completed", icon: CreditCard, desc: "Payment released to seller" },
];

const ORDER = STEPS.map((s) => s.status);

export default function TransactionTimeline({ currentStatus }) {
  const currentIdx = ORDER.indexOf(currentStatus);

  return (
    <div className="space-y-0">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const done = idx <= currentIdx;
        const active = idx === currentIdx;

        return (
          <div key={step.status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  done
                    ? "bg-primary text-white"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {done && idx < currentIdx ? <Check size={16} /> : <Icon size={16} />}
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`w-0.5 h-8 ${
                    done && idx < currentIdx ? "bg-primary" : "bg-neutral-200"
                  }`}
                />
              )}
            </div>

            <div className={`pb-8 ${active ? "" : ""}`}>
              <p
                className={`text-sm font-medium ${
                  active ? "text-primary-darker" : done ? "text-neutral-900" : "text-neutral-400"
                }`}
              >
                {step.label}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
