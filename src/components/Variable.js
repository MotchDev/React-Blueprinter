const Variable = ({ type, value, onChange, onRemove }) => {
  const types = [
    "boolean",
    "number",
    "string",
    "array",
    "object",
    "collection",
    "function",
  ];
  function handleTypeChange(newType) {
    onChange({
      type: newType,
      value,
    });
  }

  function handleValueChange(newValue) {
    onChange({
      type,
      value: newValue,
    });
  }

  return (
    <div className="variable flex">
      <div>
        <select value={type} onChange={(e) => handleTypeChange(e.target.value)}>
          {types.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-fill">
        <input
          type="text"
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder="variableName"
        />
      </div>
      <div>
        <button className="button" onClick={onRemove}>
          x
        </button>
      </div>
    </div>
  );
};

export default Variable;
