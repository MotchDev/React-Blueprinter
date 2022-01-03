import React, { useEffect, useState } from "react";

const DebouncedInput = ({ onChange, value, timeout = 300, props }) => {
  const [debouncedValue, setValue] = useState(value);
  const handleTextChange = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    setValue(value);
  }, [value]);

  useDebouncedEffect(() => onChange(debouncedValue), [debouncedValue], timeout);

  return <input onChange={handleTextChange} value={debouncedValue} />;
};

export default DebouncedInput;

function useDebouncedEffect(effect, deps, delay) {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay]);
}
