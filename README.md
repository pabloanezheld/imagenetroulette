# VisionLab // Live Computer Vision & ImageNet Roulette Explorer
### *Explorador de Visión Computacional e ImageNet Roulette en Vivo*

An interactive, bilingual educational computer vision demonstration tool designed for students to understand how neural vision models recognize, classify, and describe what appears before a camera in real time.

---

## 🌐 Bilingual Support (English 🇺🇸 & Español 🇨🇴)

Switch between **English** and **Español** at any time with the language pill in the top-right header:
- **UI Localization**: Full interface translations across HUD, telemetry, inspection panels, history, and settings.
- **Model Prompts**: Vision conditioning prompts adapt to English or Spanish, ensuring labels, reasoning, synset descriptions, and word budgets (≤30 words) are returned in the selected language.
- **Speech Synthesis Voice Adaptation**: When switching to Spanish, the Web Speech engine automatically binds to native Spanish neural voices (`es-ES`, `es-US`, `es-MX`) like Mónica, Jorge, Paulina, or Diego.

---

## 🚀 Quick Start

From this directory:

```bash
# Start the local development server:
npm run dev
```

Open **`http://localhost:3000`** in your browser (Google Chrome, Brave, Safari, or Firefox).

---

## 🎯 Key Educational Features

1. **Optical Lens & Real-Time Webcam Feed**:
   - Central interactive viewfinder with corner reticles, resolution diagnostics, and dynamic crosshairs.
   - Switch front/back cameras or mirror video orientation.

2. **ImageNet Roulette Bounding-Box Overlay**:
   - In homage to Trevor Paglen and Kate Crawford's *ImageNet Roulette*, detected faces and foreground objects display a neon yellow bounding box with an attached classification synset banner.

3. **Contextual Recognition Logic**:
   - **People / Faces**: Generates a respectful, concise 1-sentence description of who they are and how they appear (strictly **≤30 words**).
   - **Held Objects** (e.g. holding an apple, smartphone, coffee cup, notebook): Directly names the object (e.g., *"Red apple"* / *"Manzana roja"*).
   - **Dual Salience**: When both a person and object appear, recognizes the interaction concisely.

4. **Speech Synthesis (Voice Readout)**:
   - Uses the browser's native **Web Speech API** to articulate recognized objects and descriptions out loud to the classroom in English or Spanish.
   - Full mute toggle and voice profile selector.

5. **Acoustic Sound FX**:
   - Web Audio API synthesizer for acoustic camera shutter and detection chimes (works completely offline, no assets to load).

6. **Interactive Modes**:
   - **Manual Snapshot**: Click `ANALYZE FRAME` / `ANALIZAR CUADRO` or press <kbd>SPACE</kbd>.
   - **Auto-Scan Loop**: Continuously scans every 2.0s, 3.0s, or 5.0s with safe throttling.
   - **Presets**:
     - *Contextual (Default)*: ≤30 words description for people, direct name for held objects.
     - *ImageNet Synset Mode*: Exact WordNet synset code (e.g., `n07739125: apple`) & ILSVRC classification.
     - *Strict Minimal Tag*: Ultra-succinct 1 to 3 words identifier.

7. **Educational Neural Inspector**:
   - Shows students round-trip latency (ms), token consumption (prompt vs completion), estimated cost per scan (~$0.00015 on `gpt-4o-mini`), the exact conditioning prompt, and raw JSON response payloads.
   - Includes historical context explaining the difference between classic 1,000-class CNNs (AlexNet/ResNet) and modern Multimodal Vision Transformers.

8. **Scan History Drawer**:
   - Visual filmstrip of snapshots captured during the lecture, with timestamps, tags, and replay buttons.

---

## 🔒 Privacy & Local Execution

- Your **OpenAI API Key** is preloaded locally from `.env.local` or browser `localStorage`.
- Frames are captured locally via HTML5 canvas downsampling and transmitted directly to `api.openai.com` over encrypted HTTPS.
- Zero tracking or external backend servers required.
