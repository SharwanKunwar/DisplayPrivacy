import React, { useState, useEffect } from "react";

const RealPrivacy = () => {
  const [opacity, setOpacity] = useState(1);
  const [angle, setAngle] = useState(0);
  const [enabled, setEnabled] = useState(false);

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
      setEnabled(true);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    const handleOrientation = (event) => {
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;

      // Calculate tilt strength
      const dist = Math.sqrt(beta * beta + gamma * gamma);
      const maxTilt = 90;

      const norm = Math.min(dist / maxTilt, 1);

      // Convert to angle (0 → 90)
      const newAngle = norm * 90;
      setAngle(Math.round(newAngle));

      // 🎯 Your rule: 20° → start, 30° → fully hidden
      const fadeStart = 16;
      const fadeEnd = 20;

      let newOpacity = 1;

      if (newAngle <= fadeStart) {
        newOpacity = 1;
      } else if (newAngle >= fadeEnd) {
        newOpacity = 0;
      } else {
        const progress = (newAngle - fadeStart) / (fadeEnd - fadeStart);
        newOpacity = 1 - progress;
      }

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
        <h2>Real Private Content</h2>
        <p>This fades based on your phone angle.</p>
      </div>

      <div style={styles.info}>
        <p>real Angle: {angle}°</p>
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
    transition: "opacity 0.15s linear",
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