import React, { useState } from "react";

function EvaluationsForm() {
  const [categories, setCategories] = useState({
    dolorLumbar: false,
    dolorRodilla: false
  });
  const [evaluations, setEvaluations] = useState([]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setCategories((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories })
      });
      const data = await response.json();
      setEvaluations(data.evaluations || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Evaluations Form</h2>
      <form onSubmit={handleSubmit}>
        <label><input type="checkbox" name="dolorLumbar" checked={categories.dolorLumbar} onChange={handleChange} /> Dolor Lumbar</label><br/>
        <label><input type="checkbox" name="dolorRodilla" checked={categories.dolorRodilla} onChange={handleChange} /> Dolor de Rodilla</label><br/>
        <button type="submit">Obtener Evaluaciones</button>
      </form>
      {evaluations.length > 0 && (
        <div>
          <h3>Evaluaciones Sugeridas:</h3>
          <ul>
            {evaluations.map((evalItem, idx) => (
              <li key={`${evalItem}-${idx}`}>{evalItem}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EvaluationsForm;
