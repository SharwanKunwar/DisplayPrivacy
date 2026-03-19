import React, { useState, useEffect, useRef } from "react";

const PrivacyDisplay = () => {
  const [angle, setAngle] = useState(0);
  const [opacity, setOpacity] = useState(0.95);

  const requestRef = useRef(null);
  const timeRef = useRef(0);

  // smoothing refs (prevents jitter)
  const currentAngle = useRef(0);
  const currentOpacity = useRef(0.95);

  const animate = () => {
    timeRef.current += 0.015;
    const time = timeRef.current;

    // Simulated tilt
    const targetRy = Math.sin(time) * 25;
    const targetRx = Math.cos(time * 0.8) * 15;

    const dist = Math.sqrt(targetRx ** 2 + targetRy ** 2);
    const maxTilt = 40;

    const normDist = Math.min(dist / maxTilt, 1);
    const targetAngle = normDist * 85;
    const targetOpacity = Math.pow(normDist, 1.3) * 0.95;

    // Smooth interpolation (lerp)
    currentAngle.current += (targetAngle - currentAngle.current) * 0.08;
    currentOpacity.current += (targetOpacity - currentOpacity.current) * 0.08;

    // Update state less aggressively
    setAngle(Math.round(currentAngle.current));
    setOpacity(currentOpacity.current);

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="container">
      <div className="phoneFrame">
        <div className="screenContent">
          <h3>Sensitive Data</h3>
          <p>This is a simulated privacy screen.</p>
        </div>

        <div
          className="privacyOverlay"
          style={{ opacity: opacity }}
        />
      </div>

      <div className="stats">
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

export default PrivacyDisplay;