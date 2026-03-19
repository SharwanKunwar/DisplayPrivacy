import React, { useState, useEffect } from "react";

const RealPrivacy = () => {
  // Controls how visible the content is (1 = visible, 0 = hidden)
  const [opacity, setOpacity] = useState(1);

  // Stores the calculated tilt angle in degrees (for display)
  const [angle, setAngle] = useState(0);

  // Tracks whether gyroscope access is enabled
  const [enabled, setEnabled] = useState(false);

  /**
   * Request permission for device orientation (required for iOS)
   * Without this, the gyroscope will NOT work on iPhones.
   */
  const enableGyro = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === "granted") setEnabled(true);
      } catch (err) {
        console.error("Gyroscope permission error:", err);
      }
    } else {
      // Android and most browsers don't require permission
      setEnabled(true);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    /**
     * Handles device tilt changes in real-time
     * Runs whenever the phone is rotated
     */
    const handleOrientation = (event) => {
      const beta = event.beta || 0;   // front-back tilt
      const gamma = event.gamma || 0; // left-right tilt

      // Calculate overall tilt magnitude
      // This combines both axes into a single value
      const dist = Math.sqrt(beta * beta + gamma * gamma);

      const maxTilt = 90; // maximum expected tilt

      // Normalize tilt into a 0 → 1 range
      const norm = Math.min(dist / maxTilt, 1);

      // Convert normalized tilt into a readable angle
      const newAngle = norm * 90;
      setAngle(Math.round(newAngle));

      /**
       * 🎯 Privacy behavior rules:
       * - 0° to 16° → fully visible (opacity = 1)
       * - 16° to 20° → gradual fade
       * - 20°+ → fully hidden (opacity = 0)
       */
      const fadeStart = 16;
      const fadeEnd = 20;

      let newOpacity = 1;

      if (newAngle <= fadeStart) {
        // Within safe viewing angle → no fading
        newOpacity = 1;
      } else if (newAngle >= fadeEnd) {
        // Too much tilt → completely hidden
        newOpacity = 0;
      } else {
        // Linear interpolation between fadeStart and fadeEnd
        const progress =
          (newAngle - fadeStart) / (fadeEnd - fadeStart);

        // Invert progress because opacity decreases as angle increases
        newOpacity = 1 - progress;
      }

      setOpacity(newOpacity);
    };

    // Listen to device orientation changes
    window.addEventListener("deviceorientation", handleOrientation);

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [enabled]);

  return (
    <div style={styles.container}>
      {/* Button required to activate gyroscope on some devices */}
      {!enabled && (
        <button onClick={enableGyro} style={styles.button}>
          Enable Gyroscope
        </button>
      )}

      {/* Content whose visibility depends on device tilt */}
      <div style={{ ...styles.box, opacity }}>
        <h2>Real Private Content</h2>
        <p>This fades based on your phone angle.</p>
      </div>

      {/* Debug info (helps during testing and calibration) */}
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
    // Smooth transition makes fading feel natural instead of abrupt
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