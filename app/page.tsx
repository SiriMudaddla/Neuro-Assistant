"use client";

import { useState } from "react";

export default function Home() {
  // 📥 STATE EXTRACTIONS
  const [inputText, setInputText] = useState("");
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🔊 CORE FUNCTION 1: TEXT TO SPEECH
  const handleReadAloud = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; 
      window.speechSynthesis.speak(utterance);
    }
  };

  // 🎙️ CORE FUNCTION 2: SPEECH TO TEXT
  const startSpeechToText = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice dictation is not supported in this browser. Try Google Chrome!");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setInputText((prevText: string) => prevText + " " + spokenText);
    };
    recognition.start();
  };

  // 📄 CORE FUNCTION 3: GENERATE DATA CARDS
  const generateCards = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/process-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      if (data.flashcards) setFlashcards(data.flashcards);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-slate-100 text-slate-900">
      <main className="max-w-3xl mx-auto space-y-8">
        
        {/* CENTERED & EXTRA BOLD HEADING */}
        <h1 className="text-4xl font-extrabold tracking-tight text-center text-indigo-950">
          Neuro-Inclusive AI Assistant
        </h1>
        
        {/* INPUT FORM MATRIX WITH VIBRANT COLORS */}
        <div className="p-6 bg-white rounded-xl shadow-md border-2 border-slate-200 space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold text-slate-800">Enter Lesson Material or Notes</label>
            <button
              type="button"
              onClick={startSpeechToText}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-bold hover:bg-blue-800 active:scale-95 transition-all shadow-sm"
            >
              🎙️ Dictate Notes (Speak)
            </button>
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-32 p-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none font-medium transition-all"
            placeholder="Paste your study materials here..."
          />
          
          <button
            onClick={generateCards}
            disabled={isLoading}
            className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold text-lg hover:bg-emerald-700 active:scale-[0.99] disabled:bg-slate-400 transition-all shadow-md"
          >
            {isLoading ? "Processing Accessible Flashcards..." : "Generate Neuro-Friendly Cards ✨"}
          </button>
        </div>

        {/* OUTPUT INTERFACE DISPLAY WITH HIGHER CONTRAST CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flashcards.map((card, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow-md border-2 border-slate-200 flex flex-col justify-between space-y-4 hover:border-indigo-200 transition-colors">
              <p className="text-lg font-medium leading-relaxed text-slate-900">{card.text || card}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => handleReadAloud(card.text || card)}
                  className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-md text-xs hover:bg-amber-600 active:scale-95 transition-all shadow-sm"
                >
                  🔊 Read Aloud
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}