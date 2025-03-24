import React from "react";
import "./App.css";
import NexiaAssistant from "./NexiaAssistant";
import FichaClinica from "./FichaClinica";

function App() {
  return (
    <div className="App">
      {/* Columna Izquierda */}
      <div className="col-left">
        <NexiaAssistant />
      </div>

      {/* Columna Derecha */}
      <div className="col-right">
        <FichaClinica />
      </div>
    </div>
  );
}

export default App;
