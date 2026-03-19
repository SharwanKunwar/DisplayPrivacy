import React, { useState, useEffect } from "react";

const PrivacyDisplay = () => {
  const [angle, setAngle] = useState(0);
  const [opacity, setOpacity] = useState(0.2);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse position (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      // Distance from center
      const dist = Math.sqrt(x * x + y * y);
      const normDist = Math.min(dist, 1);

      // Convert to angle + opacity
      const newAngle = normDist * 85;
      const newOpacity = Math.pow(normDist, 1.3) * 0.95;

      setAngle(Math.round(newAngle));
      setOpacity(newOpacity);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.phoneFrame,
          transform: `rotateX(${angle / 3}deg) rotateY(${angle / 2}deg)`
        }}
      >
        {/* Screen Content */}
        <div style={styles.screenContent}>
          <h3>Sensitive Data</h3>
          <p>This is a simulated privacy screen.</p>
        </div>

        {/* Privacy Overlay */}
        <div
          style={{
            ...styles.privacyOverlay,
            opacity: opacity
          }}
        />
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <p>
          Viewing Angle: <strong>{angle}°</strong>
        </p>
        <p>
          Privacy Filter: <strong>{Math.round(opacity * 100)}%</strong>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#111",
    color: "white",
    fontFamily: "monospace"
  },

  phoneFrame: {
    position: "relative",
    width: "220px",
    height: "420px",
    border: "10px solid #333",
    borderRadius: "25px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
    transition: "transform 0.1s linear"
  },

  screenContent: {
    padding: "20px",
    color: "#000"
  },

  privacyOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "black",
    pointerEvents: "none",
    transition: "opacity 0.1s linear"
  },

  stats: {
    marginTop: "20px",
    textAlign: "center"
  }
};

export default PrivacyDisplay;