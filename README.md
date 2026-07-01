# Neuro-Inclusive AI Assistant 🚀

An accessible, assistive learning platform engineered to transform dense textbook text, lectures, or vocal inputs into highly structured micro-flashcards. This application is specifically designed to optimize cognitive load, visual scannability, and processing workflows for students with dyslexia, ADHD, or diverse learning styles.

---

## 📋 Project Overview

Traditional educational materials present information in heavy, intimidating blocks of text, causing rapid reading fatigue and focus drift for neurodivergent learners. This assistant restructures educational content completely on the fly. 

By enforcing strict constraints on content length, utilizing vibrant high-contrast visual anchors, offering native voice assistance, and shifting styles dynamically based on age-specific profiles, the platform helps users process and retain information effortlessly without experiencing cognitive overwhelm.

---

## ✨ Active Features (Fully Operational)

* **🎙️ Voice Assistant Dictation:** Integrates native browser speech recognition, allowing students facing typing difficulties or dysgraphia to verbally dictate textbook material straight into the input matrix.
  
* **📂 Multi-File Plain Text Processing:** Built-in multi-file handler that utilizes a `FileReader` architecture to load, clear, and stage text from multiple local files simultaneously into the active workspace.
  
* **🎨 Profile-Driven Adaptive Themes:** The central input textarea automatically switches background palettes, borders, and typography accents based on the user's selected focus profile (e.g., amber-yellow for Kids, emerald-green for Teens, deep purple for Adults) to maximize immediate visual categorization.
  
* **🧠 Smart Micro-Flashcards:** Enforces high-retention structural constraints on generated facts, utilizing short lines, scannable emoji check-points, and bold content anchors to mitigate attention drift.
  
* **🛡️ Secure Token Failover:** Decouples structural API credentials utilizing local server runtime configurations (`.env.local`) to prevent hardcoded key leakage onto public networks.



---

## 🌟 Neuro-Inclusive UX Design Frameworks

The platform implements educational design systems to support rapid processing and memory retention across distinct target groups:

### 🧒 Target Age Group Modifiers
* **Kid Track (Ages 5-12):** Translates complex subjects into relatable, simple machine or game analogies (e.g., puzzle blocks or toys) matching high-vibrancy focus accents.
  
* **Teen Track (Ages 13-19):** Bridges academic concepts with clear, linear, practical problem-solving steps.
  
* **Adult Track (Ages 20+):** Retains concise, system-level professional terminology, stripping away filler words for high-efficiency documentation.

### 📖 Cognitive Guide Profiles
* **Dyslexia Optimized:** Enforces monospaced typography, breaks up multi-clause sentences, and prefixes content blocks with explicit baseline design markers (`▶️`) to eliminate line-skipping and visual tracking fatigue.
  
* **ADHD Visual Anchors:** Clips explanations into brief, punchy bullet points and injects a floating focus lane guide overlay across the viewport to hold attention spans.
  
* **Dual-Track Mode:** Synthesizes both systems into an ultra-high-contrast focus framework.



---

## 🛠️ Technologies Used

* **Frontend Framework:** Next.js (App Router architecture driven by Turbopack)
  
* **Programming Language:** TypeScript (Strict type system safety)
  
* **Styling Engine:** Tailwind CSS & Dynamic React State Matrices
  
* **Artificial Intelligence Core:** Google Gemini SDK (`@google/generative-ai`)

---

## 📂 Folder Structure

```text
neuro-assistant/
├── app/
│   ├── api/
│   │   └── process-lesson/
│   │       └── route.ts         # Secure backend API route with fallback model architecture
│   ├── components/
│   │   └── AccessibilityPanel.tsx # Interactive toolkit for font, size, and anchor controls
│   ├── layout.tsx               # Global application wrapper and typography presets
│   └── page.tsx                 # Core adaptive dashboard with file buffers, voice, and profile themes
├── public/                      # Assets, icons, and static illustrations
├── .env.local                   # Local secret environment file (GIT IGNORED)
├── .gitignore                   # Exclusion configuration for Git version control
├── next.config.ts               # Next.js compiler settings
├── package.json                 # JavaScript dependency manifest
└── tsconfig.json                # TypeScript compilation rules


👩‍💻 Author

Siri Mudaddla



⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!
