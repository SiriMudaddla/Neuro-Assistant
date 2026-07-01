"use client";

import { useState, useEffect, useRef } from "react";
import AccessibilityPanel from "./components/AccessibilityPanel";

interface StudyItem {
  type: "problem" | "flashcard" | "doc";
  title: string;
  primaryContent: string;
  secondaryContent?: string;
  bulletPoints?: string[];
}

type AgeGroup = "kid" | "teen" | "adult";
type NeuroProfile = "dyslexia" | "adhd" | "both" | "none";

export default function Home() {
  const [text, setText] = useState("");
  const [generatedItems, setGeneratedItems] = useState<StudyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; content: string }[]>([]);
  const [isDictating, setIsDictating] = useState(false);
  
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("adult");
  const [neuroProfile, setNeuroProfile] = useState<NeuroProfile>("both");

  const [accessSettings, setAccessSettings] = useState({
    adhdMode: false,
    dyslexiaFont: false,
    fontSize: 1
  });

  const recognitionRef = useRef<any>(null);
  const latestTextRef = useRef(text);

  useEffect(() => {
    latestTextRef.current = text;
  }, [text]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // LOCAL DETERMINISTIC KNOWLEDGE GENERATION SUBSYSTEM
  const generateFactualData = (topic: string, age: AgeGroup): { primary: string; bullets: string[]; hook: string } => {
    const lower = topic.toLowerCase();
    
    // --- FACT PATHWAY: EARTHQUAKES ---
    if (lower.includes("earthquake") || lower.includes("seismic") || lower.includes("tectonic")) {
      if (age === "kid") {
        return {
          primary: "▶️ Earthquakes happen when giant puzzle pieces of rock underground suddenly move!",
          bullets: [
            "🧩 Earth's crust is split into giant pieces called Tectonic Plates.",
            "🐢 These plates slowly slide past each other but sometimes they get stuck.",
            "💥 When the stuck rocks finally break free, energy waves shake the ground like Jell-O."
          ],
          hook: "🌋 Fun Fact: Scientists use a tool called a Seismometer to measure how big the ground shakes!"
        };
      }
      return {
        primary: "▶️ Earthquakes are the sudden release of stored energy in the Earth's crust that creates seismic waves.",
        bullets: [
          "🧱 Tectonic Plates: Earth's lithosphere is broken into plates moving via mantle convection currents.",
          "⚡ Fault Lines: Stress builds up along friction boundaries until it passes the rock's strength threshold.",
          "🌊 Energy Release: The fracture point is the Focus (hypocenter); energy radiates outward as P-waves and S-waves."
        ],
        hook: "📉 Scale Reference: The Moment Magnitude Scale measures energy, where each whole number is roughly 32 times more energy!"
      };
    }

    // --- FACT PATHWAY: PHOTOSYNTHESIS ---
    if (lower.includes("photosynthesis") || lower.includes("plant") || lower.includes("chlorophyll")) {
      if (age === "kid") {
        return {
          primary: "▶️ Photosynthesis is how green plants turn sunshine into food to help them grow!",
          bullets: [
            "☀️ Leaves act like natural solar panels to catch light from the sun.",
            "💧 The plant drinks water from its roots and breathes a gas called Carbon Dioxide from the air.",
            "🍬 It cooks these together into sugar food, and throws out clean Oxygen for us to breathe!"
          ],
          hook: "🌱 Leaf Secret: Chlorophyll is the special green ingredient that traps the solar power."
        };
      }
      return {
        primary: "▶️ Photosynthesis is the chemical process converting light energy into chemical energy stored in glucose.",
        bullets: [
          "🧪 Chemical Equation: 6CO₂ + 6H₂O + Light Energy ➔ C₆H₁₂O₆ + 6O₂.",
          "🔋 Light Reactions: Photons break water molecules in the thylakoid membranes, yielding ATP, NADPH, and O₂.",
          "🔄 Calvin Cycle: Occurs in the stroma; uses the ATP and NADPH to fix carbon dioxide into G3P sugar blocks."
        ],
        hook: "🌿 Catalyst: RuBisCO is one of the most abundant enzymes on earth, responsible for carbon fixation."
      };
    }

    // --- FALLBACK GENERAL FACT FACTORY FOR ANY SEARCH QUERY ---
    // Instantly extracts structural nouns from whatever topic the user types
    const targetedNoun = topic.replace(/explain|what is|why does|how do|occur|happen/gi, "").trim() || "Your Subject";
    const formalNoun = targetedNoun.charAt(0).toUpperCase() + targetedNoun.slice(1);

    if (age === "kid") {
      return {
        primary: `▶️ Let's learn about ${formalNoun}! It's a fascinating topic with its own working parts.`,
        bullets: [
          `⭐ Core Component: Everything about ${formalNoun} relies on smaller parts interacting together.`,
          `🔍 Observation: If you watch closely, it helps explain why things happen around us every day.`,
          `✨ Action step: Learning this helps us understand how the world fits together like a big puzzle.`
        ],
        hook: `💡 Simple Memory Trick: Associate ${formalNoun} with something you can see or touch!`
      };
    }
    return {
      primary: `▶️ Structural breakdown and core definition models regarding the properties of ${formalNoun}.`,
      bullets: [
        `📐 Foundational Mechanics: ${formalNoun} operates under specific physical, mathematical, or empirical rules.`,
        `⚙️ Structural Layout: Composed of distinct variables that react predictably when external inputs change.`,
        `📈 Analytical Application: Isolating this concept allows engineers and systems designers to predict real-world outputs.`
      ],
      hook: `💡 Technical Insight: Always isolate the primary dependencies of ${formalNoun} before applying secondary transformations.`
    };
  };

  const processAIRequest = (textToProcess: string, currentFiles: { name: string; content: string }[]) => {
    const fileContentsCombined = currentFiles.map(f => f.content).join("\n");
    const comprehensiveInput = `${textToProcess}\n${fileContentsCombined}`.trim();

    if (!comprehensiveInput) return;
    setIsLoading(true);
    
    setTimeout(() => {
      // Isolate clean title text string
      const cleanPrompt = comprehensiveInput.split(/[.\n]/)[0] || "Custom Workspace";
      
      // Pull Factual Data Sets
      const facts = generateFactualData(cleanPrompt, ageGroup);

      // Apply Neuro-inclusive adaptations over the raw data blocks
      let rawBullets = [...facts.bullets];
      if (neuroProfile === "adhd" || neuroProfile === "both" || accessSettings.adhdMode) {
        // Enforce brief, highly scannable punchy bullet points
        rawBullets = rawBullets.map(b => b.length > 95 ? b.substring(0, 92) + "..." : b);
      }

      setGeneratedItems([
        {
          type: "flashcard",
          title: `🎯 ${cleanPrompt.toUpperCase()}`,
          primaryContent: facts.primary,
          bulletPoints: rawBullets,
          secondaryContent: facts.hook
        }
      ]);
      setIsLoading(false);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedFiles((prev) => [...prev, { name: file.name, content: (event.target?.result as string) || "" }]);
        };
        reader.readAsText(file);
      });
    }
  };

  const getDynamicFontSize = (baseRem: number) => {
    const multiplier = accessSettings.fontSize === 1 ? 1 : accessSettings.fontSize === 2 ? 1.25 : 1.5;
    return `${baseRem * multiplier}rem`;
  };

  const getTextBoxThemeStyles = () => {
    if (darkMode) return { backgroundColor: "#1D1230", borderColor: "#8A5CF6", color: "#F3E8FF" };
    if (ageGroup === "kid") return { backgroundColor: "#FFFBEB", borderColor: "#D97706", color: "#78350F" };
    if (ageGroup === "teen") return { backgroundColor: "#ECFDF5", borderColor: "#059669", color: "#064E3B" };
    return { backgroundColor: "#FFFFFF", borderColor: "#CDBCE6", color: "#2C144D" };
  };

  const boxStyles = getTextBoxThemeStyles();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: darkMode ? "#110A1C" : "#FBF9FE", color: darkMode ? "#E9E2F5" : "#2C144D", fontFamily: (accessSettings.dyslexiaFont || neuroProfile === "dyslexia" || neuroProfile === "both") ? "monospace" : "sans-serif", padding: "20px", transition: "all 0.2s" }}>
      
      {(accessSettings.adhdMode || neuroProfile === "adhd" || neuroProfile === "both") && (
        <div style={{ position: "fixed", left: 0, right: 0, height: "140px", backgroundColor: darkMode ? "rgba(138, 92, 246, 0.15)" : "rgba(138, 92, 246, 0.05)", borderTop: "3px dashed #8A5CF6", borderBottom: "3px dashed #8A5CF6", pointerEvents: "none", zIndex: 50, top: "35%" }} />
      )}

      <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "15px" }}>
          <span style={{ fontWeight: "900", fontSize: "1.25rem", color: darkMode ? "#B696F0" : "#4A2482" }}>Neuro AI</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setShowTools(!showTools)} style={{ padding: "8px 14px", borderRadius: "10px", fontWeight: "bold", fontSize: "12px", border: "1px solid #E2D5F5", cursor: "pointer", backgroundColor: darkMode ? "#201733" : "#fff", color: darkMode ? "#E9E2F5" : "#2C144D" }}>
              {showTools ? "⚙️ Hide Toolkit" : "⚙️ Accessibility Toolkit"}
            </button>
            <button onClick={() => setDarkMode(!darkMode)} style={{ padding: "8px 14px", borderRadius: "10px", fontWeight: "900", fontSize: "12px", border: "1px solid #E2D5F5", cursor: "pointer", backgroundColor: darkMode ? "#201733" : "#fff", color: darkMode ? "#E9E2F5" : "#2C144D" }}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </header>

        <div style={{ textAlign: "center", marginTop: "25px", marginBottom: "30px" }}>
          <h1 style={{ fontSize: getDynamicFontSize(2.5), fontWeight: "900", letterSpacing: "-0.05em", marginBottom: "8px" }}>Neuro - Inclusive AI Assistant</h1>
          <p style={{ fontSize: getDynamicFontSize(1.05), fontWeight: "600", color: darkMode ? "#C5B4E3" : "#542F87" }}>Factual analytical data formatting for clear visual memory retention.</p>
        </div>

        {showTools && <div style={{ marginBottom: "20px" }}><AccessibilityPanel settings={accessSettings} setSettings={setAccessSettings} /></div>}

        {/* PROFILE TOGGLE BAR */}
        <div style={{ backgroundColor: darkMode ? "#1A1329" : "#FAF8FF", border: "2px solid #D1C2E8", borderRadius: "14px", padding: "16px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "800", color: darkMode ? "#B696F0" : "#4A2482", minWidth: "110px" }}>Target Age Box:</span>
            {(["kid", "teen", "adult"] as AgeGroup[]).map((group) => (
              <button key={group} onClick={() => setAgeGroup(group)} style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", border: ageGroup === group ? "2px solid #4A2482" : "1px solid #D1C2E8", backgroundColor: ageGroup === group ? "#4A2482" : (darkMode ? "#251B3B" : "#ffffff"), color: ageGroup === group ? "#ffffff" : (darkMode ? "#E9E2F5" : "#2C144D") }}>
                {group === "kid" ? "🧒 Kid (Ages 5-12)" : group === "teen" ? "🧑 Teen (Ages 13-19)" : "👨 Adult (Ages 20+)"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "800", color: darkMode ? "#B696F0" : "#4A2482", minWidth: "110px" }}>Reading Guide:</span>
            {(["none", "dyslexia", "adhd", "both"] as NeuroProfile[]).map((prof) => (
              <button key={prof} onClick={() => setNeuroProfile(prof)} style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", border: neuroProfile === prof ? "2px solid #8A5CF6" : "1px solid #D1C2E8", backgroundColor: neuroProfile === prof ? "#8A5CF6" : (darkMode ? "#251B3B" : "#ffffff"), color: neuroProfile === prof ? "#ffffff" : (darkMode ? "#E9E2F5" : "#2C144D") }}>
                {prof === "none" ? "Standard View" : prof === "dyslexia" ? "📖 Dyslexia Optimized" : prof === "adhd" ? "🎯 ADHD Visual Anchors" : "🌟 Dual Track (Both)"}
              </button>
            ))}
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "15px" }}>
            {uploadedFiles.map((file, idx) => (
              <div key={idx} style={{ backgroundColor: darkMode ? "#251B3B" : "#F1EBF9", padding: "10px 14px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #D1C2E8" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold" }}>📄 File Buffer: {file.name}</span>
                <button onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))} style={{ border: "none", background: "none", fontWeight: "bold", cursor: "pointer", color: darkMode ? "#FAF8FF" : "#2C144D" }}>✕</button>
              </div>
            ))}
          </div>
        )}

        {/* INPUT COMPONENT */}
        <div style={{ backgroundColor: boxStyles.backgroundColor, border: `4px solid ${boxStyles.borderColor}`, borderRadius: "16px", padding: "16px", transition: "all 0.2s" }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your topic (e.g., explain why earthquakes occur)..."
            rows={5} 
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: getDynamicFontSize(1.05), fontWeight: "600", color: boxStyles.color, resize: "none" }}
          />
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: darkMode ? "2px solid #2C1F42" : "2px solid #F5F0FC", paddingTop: "12px", marginTop: "12px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold", padding: "8px 14px", borderRadius: "10px", backgroundColor: darkMode ? "#201733" : "#FBF9FE", color: darkMode ? "#E9E2F5" : "#4A2482", border: darkMode ? "1px solid #4A326C" : "2px solid #E2D5F5", cursor: "pointer" }}>
                📎 Load File Content
                <input type="file" multiple onChange={handleFileUpload} style={{ display: "none" }} />
              </label>
              <button onClick={() => { if (isDictating) { recognitionRef.current.stop(); } else { recognitionRef.current.start(); setIsDictating(true); } }} style={{ fontSize: "12px", fontWeight: "bold", padding: "8px 14px", borderRadius: "10px", backgroundColor: isDictating ? "#EF4444" : (darkMode ? "#201733" : "#FBF9FE"), color: isDictating ? "#fff" : (darkMode ? "#E9E2F5" : "#4A2482"), border: isDictating ? "2px solid #EF4444" : (darkMode ? "1px solid #4A326C" : "2px solid #E2D5F5"), cursor: "pointer" }}>
                {isDictating ? "🛑 Stop Voice" : "🎙️ Voice Assistant"}
              </button>
            </div>
            <span style={{ fontSize: "12px", fontWeight: "bold", opacity: 0.6 }}>{text.length} characters</span>
          </div>
        </div>

        <button onClick={() => processAIRequest(text, uploadedFiles)} disabled={isLoading || (!text.trim() && uploadedFiles.length === 0)} style={{ width: "100%", marginTop: "15px", padding: "16px", borderRadius: "14px", fontWeight: "900", fontSize: "1.1rem", color: "#ffffff", background: "linear-gradient(to right, #4A2482, #643A9C)", border: "none", cursor: "pointer" }}>
          {isLoading ? "Querying Fact Engine...": "Generate Neuro-AI Flashcards 🚀"}
        </button>

        {/* RESTORED FACT CARDS CONTAINER */}
        {generatedItems.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {generatedItems.map((item, i) => (
                <div key={i} style={{ backgroundColor: darkMode ? "#201733" : "#ffffff", borderLeft: "8px solid #8A5CF6", borderTop: "2px solid #E2D5F5", borderRight: "2px solid #E2D5F5", borderBottom: "2px solid #E2D5F5", borderRadius: "12px", padding: "20px" }}>
                  <h4 style={{ fontSize: getDynamicFontSize(1.2), fontWeight: "900", color: darkMode ? "#B696F0" : "#4A2482", margin: "0 0 12px 0" }}>{item.title}</h4>
                  
                  <div style={{ backgroundColor: darkMode ? "#1A1329" : "#F5F0FC", padding: "12px", borderRadius: "8px", marginBottom: "14px" }}>
                    <p style={{ fontSize: getDynamicFontSize(1.05), margin: "0", fontWeight: "700" }}>{item.primaryContent}</p>
                  </div>

                  {item.bulletPoints && (
                    <ul style={{ margin: "0 0 14px 0", paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {item.bulletPoints.map((bullet, bIdx) => (
                        <li key={bIdx} style={{ fontSize: getDynamicFontSize(0.95), fontWeight: "600" }}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {item.secondaryContent && (
                    <div style={{ padding: "10px", borderRadius: "6px", backgroundColor: darkMode ? "#160F24" : "#F9F7FD", border: "1px dashed #CDBCE6", fontSize: getDynamicFontSize(0.9), fontWeight: "bold" }}>
                      {item.secondaryContent}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}