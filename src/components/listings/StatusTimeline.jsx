

const statusSteps = [
  { key: 'active', label: 'Listed', description: 'Your listing is live and visible to recyclers' },
  { key: 'matched', label: 'Matched', description: 'A recycler has shown interest' },
  { key: 'completed', label: 'Completed', description: 'Waste has been collected and processed' },
  { key: 'expired', label: 'Expired', description: 'Listing has expired' },
];

const StatusTimeline = ({ currentStatus }) => {
  const currentIndex = statusSteps.findIndex(s => s.key === currentStatus);
  
  return (
    <div className="w-full py-4">
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded">
          <div
            className="h-full bg-green-500 rounded transition-all duration-500"
            style={{ width: `${Math.max((currentIndex / (statusSteps.length - 1)) * 100, 0)}%` }}
          />
        </div>
        <div className="relative flex justify-between">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            return (
              <div key={step.key} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                  isCompleted
                    ? isCurrent
                      ? 'bg-green-600 border-green-600 text-white scale-110'
                      : 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-semibold ${isCompleted ? 'text-green-700' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-gray-500 max-w-[80px] leading-tight mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusTimeline;
