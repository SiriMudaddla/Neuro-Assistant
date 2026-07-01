"use client";

import { useState } from "react";

interface AccessibilitySettings {
  adhdMode: boolean;
  dyslexiaFont: boolean;
  fontSize: number;
}

interface FlashcardDeckProps {
  cards?: string[];
  accessSettings: AccessibilitySettings;
}

export default function FlashcardDeck({ cards, accessSettings }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledDeck, setShuffledDeck] = useState<string[]>(cards || []);

  const currentCardText = shuffledDeck[currentIndex] || "";
  const splitIndex = currentCardText.indexOf(":");
  const frontSide = splitIndex !== -1 ? currentCardText.substring(0, splitIndex).trim() : "Concept Prompt";
  const backSide = splitIndex !== -1 ? currentCardText.substring(splitIndex + 1).trim() : currentCardText;

  const fontClassSize = 
    accessSettings.fontSize === 1 ? "text-base md:text-lg" :
    accessSettings.fontSize === 2 ? "text-lg md:text-xl" : "text-xl md:text-2xl font-black";

  const headerClassSize = 
    accessSettings.fontSize === 1 ? "text-2xl md:text-3xl" :
    accessSettings.fontSize === 2 ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl font-black";

  const handleReadAloud = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(isFlipped ? backSide : frontSide);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-6 relative z-10 text-[#2D1654]" style={{ maxWidth: "850px" }}>
      
      {/* Progress header status tracking text color updated */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex flex-col">
          <span className="text-sm font-black tracking-wider uppercase text-[#633B9B]">
            Card Progress
          </span>
          <span className="text-xl font-black text-[#2D1654]">
            {currentIndex + 1} <span className="text-sm text-[#633B9B] font-medium">of</span> {shuffledDeck.length}
          </span>
        </div>
        
        <button
          onClick={() => {
            setIsFlipped(false);
            setTimeout(() => setShuffledDeck([...shuffledDeck].sort(() => Math.random() - 0.5)), 150);
          }}
          className="bg-white border-2 border-[#D3C4E8] text-[#4A2582] font-black px-4 py-2 rounded-xl text-xs uppercase hover:bg-[#FAF8FF] transition-all duration-200 shadow-sm"
        >
          🔀 Shuffle Deck
        </button>
      </div>

      <div className="w-full bg-[#D3C4E8] h-3 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-[#4A2582] h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex + 1) / shuffledDeck.length) * 100}%` }}
        />
      </div>

      {/* Interactive 3D Flipping Module Box */}
      <div onClick={() => setIsFlipped(!isFlipped)} className="w-full h-80 cursor-pointer group relative select-none" style={{ perspective: "1200px" }}>
        <div className="w-full h-full rounded-2xl transition-all duration-500 relative transform-gpu shadow-xl" style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
          
          {/* FRONT - Deep Purple Gradient with Crisp White Accent text layout */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4A2582] to-[#633B9B] text-white rounded-2xl flex flex-col justify-center items-center p-8 border-2 border-[#391B66] backface-hidden" style={{ backfaceVisibility: "hidden" }}>
            <span className="absolute top-6 left-6 text-xs uppercase font-black tracking-widest bg-white/10 px-3 py-1 rounded-full">Prompt / Concept</span>
            <h3 className={`${headerClassSize} font-black text-center tracking-tight px-4 leading-snug`}>{frontSide}</h3>
            <button onClick={handleReadAloud} className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 p-2 rounded-xl text-sm font-black transition-all">🔊 Listen</button>
            <span className="absolute bottom-6 text-xs font-black bg-white/10 px-4 py-1.5 rounded-xl animate-pulse">Tap Card to Reveal Answer 🔍</span>
          </div>

          {/* BACK - High Contrast Clean Light Purple Box with Dark Purple Text */}
          <div className="absolute inset-0 bg-white text-[#2D1654] rounded-2xl flex flex-col justify-center items-center p-8 border-4 border-[#4A2582] backface-hidden" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <span className="absolute top-6 left-6 text-xs uppercase font-black tracking-widest bg-[#F3EFFFF] text-[#4A2582] border border-[#D3C4E8] px-3 py-1 rounded-full">Explanation Breakdown</span>
            <button onClick={handleReadAloud} className="absolute top-5 right-5 bg-[#F3EFFFF] border border-[#D3C4E8] hover:bg-[#EAE4F7] p-2 rounded-xl text-sm transition-all">🔊 Listen</button>
            <p className={`${fontClassSize} text-center leading-relaxed max-w-xl px-2 overflow-y-auto max-h-48 mt-4 font-bold`}>{backSide}</p>
            <span className="absolute bottom-6 text-xs font-black text-[#633B9B]">Tap Card to Flip Back ↩️</span>
          </div>

        </div>
      </div>

      {/* Navigation Buttons Row */}
      <div className="flex items-center gap-6 mt-8 w-full justify-center">
        <button onClick={() => { setIsFlipped(false); setTimeout(() => setCurrentIndex(p => (p - 1 + shuffledDeck.length) % shuffledDeck.length), 150); }} className="bg-white border-2 border-[#D3C4E8] text-[#4A2582] px-6 py-3.5 rounded-xl font-black text-sm uppercase hover:bg-[#FAF8FF] transition-all shadow-md">⬅️ Prev</button>
        <button onClick={() => { setIsFlipped(false); setTimeout(() => setCurrentIndex(p => (p + 1) % shuffledDeck.length), 150); }} className="bg-white border-2 border-[#D3C4E8] text-[#4A2582] px-6 py-3.5 rounded-xl font-black text-sm uppercase hover:bg-[#FAF8FF] transition-all shadow-md">Next ➡️</button>
      </div>

    </div>
  );
}