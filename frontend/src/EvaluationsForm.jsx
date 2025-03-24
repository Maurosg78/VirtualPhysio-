import React, { useState } from "react";

function EvaluationsForm() {
  const [notes, setNotes] = useState("");
  const [analysis, setAnalysis] = useState(null);

  // Llama al endpoint de Nexia con la anamnesis
  const handleAnalyze = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: notes })
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Error al analizar notas:", error);
    }
  };

  return (
    <div>
      <h2>Notepad (Anamnesis)</h2>
      <label htmlFor="notepad">Anamnesis:</label><br />
      <textarea
        id="notepad"
        rows={8}
        cols={50}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Escribe aquí la anamnesis libremente..."
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleAnalyze}>Analizar con Nexia</button>
      </div>

      {analysis && (
        <div style={{ marginTop: "20px" }}>
          <h3>Resultado de Análisis:</h3>
          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default EvaluationsForm;
