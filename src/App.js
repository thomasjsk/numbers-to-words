import { useState, useMemo } from "react";
import { parse } from "./parser";

function App() {
  const [numericValue, setNumericValue] = useState("");
  const handleChange = (event) => {
    setNumericValue(event.target.value.slice(0, 9));
  };
  const text = useMemo(() => {
    try {
      return parse(numericValue);
    } catch (err) {
      return "";
    }
  }, [numericValue]);

  return (
    <div>
      <input value={numericValue} onChange={handleChange} type="text" />
      <div>
        <p>Output: {text}</p>
      </div>
    </div>
  );
}

export default App;
