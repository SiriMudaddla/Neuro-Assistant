"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Starting with False (Light Mode) so you don't get stuck on an unstyled black screen
  const [darkMode, setDarkMode] = useState(false); 

  // Safely hook into localStorage without crashing the build engine
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleGenerate = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleDictate = () => {
    alert("Voice modules are standing by for Phase 3 activation!");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* Page Canvas - Dynamic Background Toggle */}
      <div className="min-h-screen bg-slate-100 dark:bg-[#0B0813] text-slate-900 dark:text-slate-100 px-4 py-8 md:py-16 transition-colors duration-300 flex flex-col items-center w-full font-sans relative overflow-hidden">
        
        {/* Background Decorative Ambient Purple Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none hidden dark:block" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none hidden dark:block" />

        {/* Top Control Bar */}
        <div className="w-full flex justify-end mb-12 relative z-10" style={{ maxWidth: "850px" }}>
          <button
            onClick={toggleTheme}
            className="bg-white dark:bg-[#161224] border-2 border-purple-200 dark:border-purple-900/60 text-purple-700 dark:text-purple-200 font-black px-5 py-2.5 rounded-xl text-sm tracking-wide uppercase shadow-md hover:bg-purple-50 dark:hover:bg-purple-900/30 active:scale-95 transition-all duration-200"
          >
            {darkMode ? "☀️ Switch to Light" : "🌙 Switch to Dark"}
          </button>
        </div>

        {/* Hero Header Section */}
        <div className="text-center max-w-3xl mb-12 relative z-10 px-2">
          {/* Increased text size to text-4xl/text-6xl */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-6 leading-tight">
            Neuro-Inclusive AI Assistant
          </h1>
          {/* Increased text size to text-base/text-lg */}
          <p className="text-base md:text-lg text-slate-600 dark:text-purple-200/70 font-medium leading-relaxed max-w-2xl mx-auto">
            Transform heavy textbook contents, disorganized lecture notes, or complex topics into structured, sensory-friendly interactive flashcards automatically.
          </p>
        </div>

        {/* Core Input Card Module (Spacious 850px Center Bound) */}
        <div 
          className="bg-white dark:bg-[#120E1E] rounded-2xl shadow-2xl border border-slate-200 dark:border-purple-950/40 w-full overflow-hidden flex flex-col mx-auto transition-all duration-300 relative z-10"
          style={{ maxWidth: "850px" }}
        >
          {/* Top Header of the Input Card */}
          <div className="bg-slate-50/90 dark:bg-[#19142A]/60 px-6 py-5 border-b border-slate-200 dark:border-purple-950/50 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              {/* Increased text size to text-base/text-lg */}
              <span className="font-black text-slate-800 dark:text-purple-100 text-base md:text-lg tracking-tight">
                Study Canvas
              </span>
              <span className="text-xs md:text-sm font-medium text-slate-400 dark:text-purple-400/60">
                Drop your reading material or assignments below
              </span>
            </div>
            <button
              onClick={handleDictate}
              className="bg-indigo-50 dark:bg-purple-950/50 text-indigo-700 dark:text-purple-300 border border-indigo-200 dark:border-purple-900/60 hover:bg-indigo-100 dark:hover:bg-purple-900/80 px-4 py-2.5 rounded-xl text-xs md:text-sm font-extrabold flex items-center gap-2 shadow-xs transition-all duration-200"
            >
              🎙️ Dictate Notes
            </button>
          </div>

          {/* Text Input Context Area */}
          <div className="p-6 flex flex-col space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste complex topics, lecture outlines, or textbook chapters here..."
              rows={8}
              disabled={isLoading}
              /* Increased text size to text-base and added comfortable line-height */
              className="w-full p-4 border border-slate-200 dark:border-purple-950/60 bg-slate-50/40 dark:bg-[#090710]/80 text-slate-900 dark:text-purple-50 placeholder-slate-400 dark:placeholder-purple-400/40 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 focus:bg-white dark:focus:bg-[#090710] focus:outline-none resize-none text-base font-medium leading-relaxed transition-all duration-200"
            />

            {/* Metrics Footer Section */}
            <div className="flex items-center justify-between text-xs md:text-sm font-bold text-slate-400 dark:text-purple-400/50 px-1">
              <span>Character Count: {text.length}</span>
              <span>Formatting Target: Markdown Flashcards</span>
            </div>

            {/* Generation Button Module */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !text.trim()}
                /* Scaled padding, text size (text-base), and font density */
                className={`w-full py-4 rounded-xl font-black text-white transition-all duration-200 text-base tracking-wide shadow-lg ${
                  isLoading || !text.trim()
                    ? "bg-slate-200 dark:bg-purple-950/20 text-slate-400 dark:text-purple-900/40 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.995] shadow-purple-500/10 cursor-pointer"
                }`}
              >
                {isLoading ? "Processing Material Engine..." : "Generate Interactive Flashcards ✨"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}