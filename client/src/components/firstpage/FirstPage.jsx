import { useState } from "react";
import axios from "axios";
import "./firstPage.css";

function FirstPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://localhost:5000/analyze", { text });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Something went wrong." });
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">Main Character Syndrome Detector</h1>

      <textarea
        className="textarea"
        placeholder="Describe your day like a movie scene..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button className="button" onClick={analyze}>
        Analyze My Existence
      </button>

      {loading && (
        <p className="loading">
          Analyzing your narrative arc...
        </p>
      )}

      {result && !result.error && (
        <div className="card">
          <h2>🎯 Score: {result.score}/100</h2>
          <h3 className="role">{result.role}</h3>

          <p className="analysis">{result.analysis}</p>

          <hr />

          <div className="metrics">
  <small>Are you directing your day or just reacting?</small>
  <p>Control: {result.metrics?.control}</p>
  
  <small>Are you noticeable or blending into the background?</small>
  <p>Visibility: {result.metrics?.visibility}</p>
  
  <small>Are you affecting others or just observing?</small>
  <p>Influence: {result.metrics?.influence}</p>
  
</div>

          <p className="status">
            Narrative Status:{" "}
            {result.score < 30
              ? "Background Energy"
              : result.score < 70
              ? "Side Character Arc"
              : "Main Character Potential"}
          </p>
        </div>
      )}

      {result?.error && (
        <p className="error">{result.error}</p>
      )}
    </div>
  );
}

export default FirstPage;
