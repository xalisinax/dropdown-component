import { useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Dropdown, Option } from "../lib";
import { FaBeer } from "react-icons/fa";
function App() {
  const options = useMemo(
    () => [
      { value: "1", label: "Option 1", icon: <FaBeer /> },
      { value: "2", label: "Option 2" },
      { value: "3", label: "Option 3" },
      { value: "4", label: "Option 4" },
      { value: "5", label: "Option 5" },
    ],
    []
  );

  const [values, setValue] = useState<Option[]>([]);

  const changeHandler = (newValues: Option[]) => setValue(newValues);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Dropdown initialOptions={options} value={values} onChange={changeHandler} allowCreate placeholder="select..." />
      </div>
      <p className="read-the-docs">Selected values are : {JSON.stringify(values)}</p>
    </>
  );
}

export default App;
