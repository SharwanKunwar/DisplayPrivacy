# 📱 Gyroscope-Based Privacy Screen (React)

A React component that dynamically adjusts content visibility based on **device tilt (gyroscope)**.  
It simulates a privacy filter where content fades as the device is tilted.

---

## ✨ Features

- 📱 Real-time device orientation tracking using gyroscope  
- 🎯 Angle-based opacity control  
- 🔒 Privacy threshold system:
  - 0°–16° → Fully visible  
  - 16°–20° → Smooth fading  
  - 20°+ → Fully hidden  
- 🔘 iOS permission handling support  
- 🔁 Continuous real-time updates  
- 🧪 Debug information (angle & opacity display)  

---

## 🧠 How It Works

1. User clicks **Enable Gyroscope**
2. Browser requests permission (required for iOS)
3. Device starts sending orientation data (`beta`, `gamma`)
4. Tilt is calculated using both axes
5. Tilt is converted into a normalized value (0 → 1)
6. That value is mapped to an angle (0° → 90°)
7. Opacity is calculated based on the angle
8. UI updates in real time

---

## 📐 Core Logic

### Tilt Calculation
```js
const dist = Math.sqrt(beta * beta + gamma * gamma);
```

Normalization
```js
const norm = Math.min(dist / 90, 1);
```

Angle Mapping
```js
const newAngle = norm * 90;
```

Opacity Logic (Important)
```js
const fadeStart = 16;
const fadeEnd = 20;

let newOpacity = 1;

if (newAngle <= fadeStart) {
  newOpacity = 1;
} else if (newAngle >= fadeEnd) {
  newOpacity = 0;
} else {
  const progress =
    (newAngle - fadeStart) / (fadeEnd - fadeStart);

  newOpacity = 1 - progress;
}
```


📊 Behavior Table

| Angle     | Opacity   | Result        |
| --------- | --------- | ------------- |
| 0° – 16°  | 1.0       | Fully visible |
| 16° – 20° | 1.0 → 0.0 | Smooth fading |
| 20°+      | 0.0       | Fully hidden  |


## 🔐 Enable Gyroscope
* Click the Enable Gyroscope button
* Required on iOS devices for sensor access
* Works only on supported mobile devices

## ⚠️ Requirements
* HTTPS (required for device sensors)
* Mobile device with gyroscope support
* Modern browser (Chrome, Safari, Edge)


## 🚫 Limitations
* ❌ Does not work properly on most desktops
* ❌ Requires user interaction on iOS
* ❌ Sensor accuracy varies by device
* ❌ No gyroscope = no functionality



## 🚀 Possible Improvements
* Add blur instead of opacity
* Add sensitivity control
* Add 3D tilt effect
* Add fallback (mouse input)
* Optimize performance
* Improve UI/UX design


## 🧾 Summary
This project demonstrates how to:
    Convert real-world physical movement (device tilt) into dynamic UI behavior using React and the device orientation API.


## 🧠 Note
* This is a simple demonstration of combining:
* Hardware input (gyroscope)
* Mathematical modeling
* UI responsiveness
* to create interactive experiences.