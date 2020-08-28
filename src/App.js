import React from "react";
import "./styles.css";
import { statement } from "./statement";
import * as invoices from "./data/invoices.json";
import * as plays from "./data/plays.json";

export default function App() {
  return (
    <div className="App">
      {statement(invoices, plays)}
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
