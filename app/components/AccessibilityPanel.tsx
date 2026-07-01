"use client";

interface AccessibilitySettings {
  adhdMode: boolean;
  dyslexiaFont: boolean;
  fontSize: number;
}

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
}

export default function AccessibilityPanel({ settings, setSettings }: AccessibilityPanelProps) {
  return (
    <div className="w-full bg-white dark:bg-[#1B152A] rounded-2xl border border-[#D3C4E8] dark:border-[#3C2A5C] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
      <div className="flex flex-col text-center sm:text-left">
        <span className="text-xs font-black uppercase tracking-wider text-[#633B9B] dark:text-[#A896C7]">
          Accessibility Toolkit
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* ADHD Toggle */}
        <button
          onClick={() => setSettings(p => ({ ...p, adhdMode: !p.adhdMode }))}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            settings.adhdMode 
              ? "bg-[#4A2582] border-[#4A2582] text-white" 
              : "bg-[#FAF8FF] dark:bg-[#251D3A] border-[#D3C4E8] dark:border-[#3C2A5C] text-[#4A2582] dark:text-[#C5B3E6]"
          }`}
        >
          👁️ ADHD Focus
        </button>

        {/* Font Toggle */}
        <button
          onClick={() => setSettings(p => ({ ...p, dyslexiaFont: !p.dyslexiaFont }))}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            settings.dyslexiaFont 
              ? "bg-[#4A2582] border-[#4A2582] text-white" 
              : "bg-[#FAF8FF] dark:bg-[#251D3A] border-[#D3C4E8] dark:border-[#3C2A5C] text-[#4A2582] dark:text-[#C5B3E6]"
          }`}
        >
          🔤 Mono Font
        </button>

        {/* Font Increment Row */}
        <div className="flex items-center bg-[#FAF8FF] dark:bg-[#251D3A] border border-[#D3C4E8] dark:border-[#3C2A5C] rounded-lg p-0.5">
          <button
            onClick={() => setSettings(p => ({ ...p, fontSize: Math.max(1, p.fontSize - 1) }))}
            disabled={settings.fontSize === 1}
            className="px-2 py-1 font-black text-xs text-[#4A2582] dark:text-[#C5B3E6] disabled:opacity-30"
          >
            -
          </button>
          <span className="px-2 text-[10px] font-black uppercase tracking-widest text-[#633B9B] dark:text-[#A896C7]">
            Size {settings.fontSize}
          </span>
          <button
            onClick={() => setSettings(p => ({ ...p, fontSize: Math.min(3, p.fontSize + 1) }))}
            disabled={settings.fontSize === 3}
            className="px-2 py-1 font-black text-xs text-[#4A2582] dark:text-[#C5B3E6] disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}