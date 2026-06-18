import React from 'react';

const statusSteps = [
  { key: 'active', label: 'Active', description: 'Listing is live' },
  { key: 'completed', label: 'Completed', description: 'Waste collected and processed' },
];

const StatusTimeline = ({ currentStatus, onStatusChange, isEditable }) => {
  const currentIndex = statusSteps.findIndex(s => s.key === currentStatus);

  return (
    <div className="w-full py-4">
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded">
          <div
            className="h-full bg-green-500 rounded transition-all duration-500"
            style={{ width: currentIndex === 1 ? '100%' : '0%' }}
          />
        </div>

        <div className="relative flex justify-between">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const canClick = isEditable && index === 0 && currentStatus === 'active';

            return (
              <div
                key={step.key}
                className={`flex flex-col items-center ${canClick ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => canClick && onStatusChange?.('completed')}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                    isCompleted
                      ? isCurrent
                        ? 'bg-green-600 border-green-600 text-white scale-110 shadow-lg shadow-green-200'
                        : 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
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
                  {index === 0 && currentStatus === 'active' && isEditable && (
                    <p className="text-[10px] text-green-600 mt-1 font-medium">Mark Completed</p>
                  )}
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
