import React from 'react';

const statusSteps = [
  { key: 'active', label: 'Listed', description: 'Your listing is live and visible to recyclers' },
  { key: 'matched', label: 'Matched', description: 'A recycler has shown interest' },
  { key: 'completed', label: 'Completed', description: 'Waste has been collected and processed' },
  { key: 'expired', label: 'Expired', description: 'Listing has expired' },
];

const StatusTimeline = ({ currentStatus, onStatusChange, isEditable }) => {
  const currentIndex = statusSteps.findIndex(s => s.key === currentStatus);
  
  const handleClick = (index) => {
    if (!isEditable) return;
    // Only allow moving forward one step at a time, or to expired
    if (index === currentIndex + 1 || statusSteps[index].key === 'expired') {
      onStatusChange?.(statusSteps[index].key);
    }
  };

  return (
    <div className="w-full py-4">
      <div className="relative">
        {/* Progress bar */}
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
            const isNext = index === currentIndex + 1;
            const canClick = isEditable && (isNext || (step.key === 'expired' && currentStatus !== 'expired'));
            
            return (
              <div 
                key={step.key} 
                className={`flex flex-col items-center ${canClick ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => handleClick(index)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                    isCompleted
                      ? isCurrent
                        ? 'bg-green-600 border-green-600 text-white scale-110 shadow-lg shadow-green-200'
                        : 'bg-green-500 border-green-500 text-white'
                      : canClick
                        ? 'bg-white border-green-400 text-green-400 hover:bg-green-50 hover:scale-105'
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
                  <p className={`text-xs font-semibold ${isCompleted ? 'text-green-700' : canClick ? 'text-green-500' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-gray-500 max-w-[80px] leading-tight mt-1">
                    {step.description}
                  </p>
                  {canClick && (
                    <p className="text-[10px] text-green-600 mt-1 font-medium">Click to advance</p>
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
