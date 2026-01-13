\# Canvas Particle Morphing (Mobile Optimized)



A lightweight, dependency-free HTML5 Canvas particle system designed for \*\*high-performance text morphing\*\*. 



Originally built for the \[Quants Note](https://www.quantsnote.com) "About Me" page, this project solves common issues found in typical particle tutorials, specifically targeting mobile browser compatibility and performance.



\## 🚀 Key Features



\* \*\*Mobile First \& Touch Support\*\*: 

&nbsp;   \* Full support for `touchstart`/`touchmove` events.

&nbsp;   \* Automatic fallback for container height collapse on mobile layouts.

&nbsp;   \* Responsive font sizing based on canvas dimensions.

\* \*\*High-DPR Ready\*\*: 

&nbsp;   \* Uses `Math.floor` and proper scaling to avoid sub-pixel rendering artifacts on Retina/4K screens.

&nbsp;   \* Ensures sharp edges even for complex mathematical symbols (e.g., Q, α, β, Σ).

\* \*\*Performance Optimized\*\*: 

&nbsp;   \* \*\*IntersectionObserver Integration\*\*: Automatically pauses the animation loop when the element is off-screen to save battery life.

&nbsp;   \* \*\*Font Loading Safety\*\*: Waits for `document.fonts.ready` to prevent "blank canvas" glitches on slow connections.

\* \*\*Organic Effects\*\*: 

&nbsp;   \* Particles feature a "breathing" size/opacity effect.

&nbsp;   \* Includes collision physics for mouse/touch interaction.



\## 📦 Usage



1\.  \*\*HTML Structure\*\*:

&nbsp;   Create a container div with an ID.

&nbsp;   ```html

&nbsp;   <div id="particle-logo-container" style="width: 100%; height: 500px;"></div>

&nbsp;   ```



2\.  \*\*Include Script\*\*:

&nbsp;   ```html

&nbsp;   <script src="particle.js"></script>

&nbsp;   ```



3\.  \*\*Configuration\*\*:

&nbsp;   Edit the `CONFIG` object in `particle.js` to change symbols, colors, or speeds.

&nbsp;   ```javascript

&nbsp;   const CONFIG = {

&nbsp;       textArray: \['Q', 'α', 'β', 'λ'], // Your symbols here

&nbsp;       colors: \['#38bdf8', '#EBAD28'],  // Your brand colors

&nbsp;       // ...

&nbsp;   };

&nbsp;   ```



\## 🧠 Technical Details



Unlike standard particle implementations that often use a fixed sampling rate, this project dynamically adjusts based on device type to balance performance (FPS) and visual fidelity. It also implements a "Jitter" effect to prevent particles from aligning to the pixel grid, creating a more organic, fluid appearance.



\## 🔗 About



Maintained by \*\*Quants Note\*\*.

Connecting Financial Engineering, Python, and Technical SEO.



\- \*\*Blog\*\*: \[Quants Note](https://www.quantsnote.com)

\- \*\*Academy\*\*: \[Academy Q](https://academy.quantsnote.com)

\- \*\*Tool\*\*: \[Compound Interest Calculator](https://www.quantsnote.com/compound-interest-calculator/)



\## 📄 License



MIT License.

