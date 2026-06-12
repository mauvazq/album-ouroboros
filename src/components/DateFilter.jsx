export default function DateFilter({ value, onChange, label = 'Filtrar por fecha' }) {
  const setField = (field, fieldValue) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const clearFilter = () => {
    onChange({ from: '', to: '' });
  };

  const hasFilter = value.from || value.to;

  return (
    <div className="date-filter" aria-label={label}>
      <div className="date-filter-title">{label}</div>
      <label>
        Desde
        <input
          className="form-input"
          type="date"
          value={value.from}
          max={value.to || undefined}
          onChange={(e) => setField('from', e.target.value)}
        />
      </label>
      <label>
        Hasta
        <input
          className="form-input"
          type="date"
          value={value.to}
          min={value.from || undefined}
          onChange={(e) => setField('to', e.target.value)}
        />
      </label>
      {hasFilter && (
        <button className="filter-clear" type="button" onClick={clearFilter}>
          Limpiar
        </button>
      )}
    </div>
  );
}
