import React from "react";
import "./styles.css";
import { statement } from "./statement";
import invoices from "./data/invoices.json";
import plays from "./data/plays.json";

export default function App() {
  return (
    <div className="App">
      <h1>Jacob's Playground</h1>
      <p style={{ whiteSpace: "pre-line", lineHeight: "2" }}>
        {statement(invoices[0], plays)}
      </p>
    </div>
  );
}
