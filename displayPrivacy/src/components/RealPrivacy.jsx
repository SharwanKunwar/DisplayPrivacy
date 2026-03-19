import React, { useState, useEffect } from "react";

const RealPrivacy = () => {
  const [opacity, setOpacity] = useState(1);
  const [angle, setAngle] = useState(0);
  const [enabled, setEnabled] = useState(false);

  // Enable gyroscope (needed for iPhone)
  const enableGyro = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === "granted") setEnabled(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setEnabled(true); // Android
    }
  };

  useEffect(() => {
    if (!enabled) return;

    const handleOrientation = (event) => {
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;

      const dist = Math.sqrt(beta * beta + gamma * gamma);
      const maxTilt = 90;

      const norm = Math.min(dist / maxTilt, 1);

      // 🎯 5% threshold logic
      const threshold = 0.05;
      let adjusted = 0;

      if (norm > threshold) {
        adjusted = (norm - threshold) / (1 - threshold);
      }

      const newAngle = norm * 90;

      // Smooth fade after threshold
      const newOpacity = 1 - Math.pow(adjusted, 2);

      setAngle(Math.round(newAngle));
      setOpacity(newOpacity);
    };

    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [enabled]);

  return (
    <div style={styles.container}>
      {!enabled && (
        <button onClick={enableGyro} style={styles.button}>
          Enable Gyroscope
        </button>
      )}

      <div style={{ ...styles.box, opacity }}>
        <h2>Private Content</h2>
        <p>Visible only when phone is straight</p>
      </div>

      <div style={styles.info}>
        <p>Angle: {angle}°</p>
        <p>Opacity: {Math.round(opacity * 100)}%</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    background: "#111",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: "260px",
    height: "160px",
    background: "#fff",
    color: "#000",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    transition: "opacity 0.15s ease",
  },
  info: {
    marginTop: "20px",
  },
  button: {
    marginBottom: "20px",
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "8px",
    border: "none",
  },
};

export default RealPrivacy;