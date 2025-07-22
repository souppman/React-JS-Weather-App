//temp toggle
export default function UnitToggle({ unit, onUnitChange }) {
  return (
    <div className="unit-toggle">
      <button 
        className={`unit-button ${unit === 'metric' ? 'active' : ''}`}
        onClick={() => onUnitChange('metric')}
      >
        °C
      </button>
      <button 
        className={`unit-button ${unit === 'imperial' ? 'active' : ''}`}
        onClick={() => onUnitChange('imperial')}
      >
        °F
      </button>
    </div>
  );
}
