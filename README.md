# Neuro-Inclusive AI Assistant 🚀

An accessible, AI-powered assistive learning platform engineered to transform dense textbook text, lectures, or vocal inputs into highly structured micro-flashcards. 

This application is specifically designed to optimize cognitive load, visual scannability, and processing workflows for students with dyslexia and ADHD.

---

## 📋 Project Overview

Traditional educational materials present information in heavy, intimidating blocks of text, causing rapid reading fatigue and focus drift for neurodivergent learners. This assistant leverages Generative AI to completely restructure educational content. 

By enforcing strict constraints on content length, utilizing vibrant high-contrast visual anchors, and offering native bi-directional speech utilities, the platform helps users process and retain information effortlessly without experiencing cognitive overwhelm.

---

## ✨ Active Features (Fully Operational)

* **🎙️ Speech-to-Text Voice Dictation:** Integrates native browser speech recognition, allowing students facing typing difficulties or dysgraphia to verbally dictate textbook material straight into the input matrix via the **"Dictate Notes (Speak)"** engine.
  
* **🔊 Text-to-Speech Auditory Readout:** Every generated flashcard includes an interactive **"Read Aloud"** controller that reads content back to the student at a calibrated, comfortable cadence ($0.85\times$ speed) to maximize listening comprehension.
  
* **🧠 Smart Micro-Flashcards:** Enforces an absolute upper limit of **3 sentences maximum per card** to mitigate attention drift and ensure key educational concepts are processed in high-retention windows.
  
* **🎨 High-Contrast Vibrant Theme:** Features a centered, extra-bold typography layout using deep indigo (`#0f172a`), electric blue, and crisp emerald green design anchors to eliminate "visual crowding" and maximize scannability.
  
* **🛡️ Secure Token Failover:** Decouples structural API credentials completely utilizing local server runtime configurations (`.env.local`) to prevent hardcoded key leakage onto public networks.

---

## 🛠️ Technologies Used

* **Frontend Framework:** Next.js 16.2+ (App Router architecture driven by Turbopack)
  
* **Programming Language:** TypeScript (Strict type system safety)
  
* **Styling Engine:** Tailwind CSS
  
* **Artificial Intelligence Core:** Google Gemini SDK (`@google/generative-ai`)

---

## 📂 Folder Structure

```text
neuro-assistant/
├── app/
│   ├── api/
│   │   └── process-lesson/
│   │       └── route.ts       # Secure backend API route with fallback model architecture
│   ├── layout.tsx             # Global application wrapper and typography presets
│   └── page.tsx               # Main interactive dashboard with speech utilities & theme layout
├── public/                    # Assets, icons, and static illustrations
├── .env.local                 # Local secret environment file (GIT IGNORED)
├── .gitignore                 # Exclusion configuration for Git version control
├── next.config.ts             # Next.js compiler settings
├── package.json               # JavaScript dependency manifest
└── tsconfig.json              # TypeScript compilation rules


👩‍💻 Author

Siri Mudaddla

⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!
