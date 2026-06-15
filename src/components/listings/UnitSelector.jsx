// src/components/listings/UnitSelector.jsx

const UNITS = [
  { value: 'kg', label: 'Kilograms (kg)', icon: '' },
  { value: 'pieces', label: 'Pieces', icon: '' },
  { value: 'bags', label: 'Bags', icon: '' },
  { value: 'tons', label: 'Tons', icon: '' },
  { value: 'liters', label: 'Liters', icon: '' },
];

const UnitSelector = ({ value, onChange, materialUnit }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Unit of Measurement
        {materialUnit && (
          <span className="text-xs text-gray-500 ml-1">
            (Material default: {materialUnit})
          </span>
        )}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {UNITS.map((unit) => (
          <button
            key={unit.value}
            type="button"
            onClick={() => onChange(unit.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm transition-all ${
              value === unit.value
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <span className="text-lg">{unit.icon}</span>
            <span className="font-medium">{unit.label}</span>
          </button>
        ))}
      </div>
      {materialUnit && value !== materialUnit && (
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
          Note: You selected a different unit than the material default ({materialUnit}).
          Make sure to convert your quantity correctly.
        </p>
      )}
    </div>
  );
};

export default UnitSelector;
