"use client";

import { Moon, Sun, Brain } from "lucide-react";
import { motion } from "framer-motion";

interface NavbarProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export default function Navbar({
  darkMode,
  toggleTheme,
}: NavbarProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container-xl py-6"
    >
      <div className="glass rounded-full px-7 py-4 flex items-center justify-between">

        {/* Logo */}

        <div className="flex items-center gap-3">

          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">

            <Brain className="text-white" size={24} />

          </div>

          <div>

            <h2 className="text-xl font-bold">
              Neuro Assistant
            </h2>

            <p className="text-sm text-[var(--muted)]">
              Inclusive AI Learning
            </p>

          </div>

        </div>

        {/* Right Buttons */}

        <div className="flex items-center gap-3">

          <button
            className="secondary-btn px-5 py-3 flex items-center gap-2"
          >
            Settings
          </button>

          <button
            onClick={toggleTheme}
            className="primary-btn px-5 py-3 flex items-center gap-2"
          >
            {darkMode? (
              <>
                <Sun size={18} />
                Light
              </>
            ) : (
              <>
                <Moon size={18} />
                Dark
              </>
            )}
          </button>

        </div>

      </div>
    </motion.nav>
  );
}