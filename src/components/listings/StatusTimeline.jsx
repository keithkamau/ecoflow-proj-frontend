import { Clock, CheckCircle, Truck, Package } from "lucide-react";

const STEPS = [
  { key: "waiting", label: "Waiting", icon: Clock, desc: "Listing created, awaiting offers" },
  { key: "offer_accepted", label: "Offer Accepted", icon: CheckCircle, desc: "Seller accepted a recycler's offer" },
  { key: "awaiting_pickup", label: "Awaiting Pickup", icon: Truck, desc: "Recycler scheduled to collect" },
  { key: "pickup_complete", label: "Pickup Complete", icon: Package, desc: "Waste collected and transaction completed" },
];

const ORDER = STEPS.map(s => s.key);

export default function StatusTimeline({ currentStatus }) {
  const currentIdx = ORDER.indexOf(currentStatus);

  return (
    <div className="space-y-0">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const done = idx <= currentIdx;
        const active = idx === currentIdx;

        return (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  done
                    ? "bg-primary text-white"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {done && idx < currentIdx ? <CheckCircle size={16} /> : <Icon size={16} />}
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
