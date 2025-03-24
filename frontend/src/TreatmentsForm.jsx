import React, { useState } from "react";

function TreatmentsForm() {
  const [categories, setCategories] = useState({ dolorLumbar: false });
  const [evalResults, setEvalResults] = useState({ flexion: "", lasegue: "" });
  const [treatments, setTreatments] = useState([]);

  const handleCategoryChange = (e) => {
    const { name, checked } = e.target;
    setCategories((prev) => ({ ...prev, [name]: checked }));
  };

  const handleEvalChange = (e) => {
    const { name, value } = e.target;
    setEvalResults((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/treatments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories, evalResults }),
      });
      const data = await response.json();
      setTreatments(data.treatments || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Treatments Form</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", margin: "5px 0" }}><input type="checkbox" name="dolorLumbar" checked={categories.dolorLumbar} onChange={handleCategoryChange} /> Dolor Lumbar</label>
        <label style={{ display: "block", margin: "5px 0" }}>Flexión:<select name="flexion" value={evalResults.flexion} onChange={handleEvalChange} style={{ marginLeft: "5px" }}>
          <option value="">-- Seleccionar --</option>
          <option value="limitada">Limitada</option>
          <option value="normal">Normal</option>
        </select></label>
        <label style={{ display: "block", margin: "5px 0" }}>Lasègue:<select name="lasegue" value={evalResults.lasegue} onChange={handleEvalChange} style={{ marginLeft: "5px" }}>
          <option value="">-- Seleccionar --</option>
          <option value="positiva">Positiva</option>
          <option value="negativa">Negativa</option>
        </select></label>
        <button type="submit" style={{ marginTop: "10px" }}>Obtener Tratamientos</button>
      </form>
      {treatments.length > 0 && (
        <div>
          <h3>Tratamientos Sugeridos:</h3>
          <ul>
            {treatments.map((treat, idx) => (
              <li key={`${treat}-${idx}`}>{treat}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TreatmentsForm;
