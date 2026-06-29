"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain } from "lucide-react";

export default function Hero() {
  return (
    <section className="container-xl pt-8 pb-14">

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >

        {/* Badge */}

        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium mb-8 shadow-sm">

          <Sparkles size={16} />

          AI Powered Learning

        </div>

        {/* Heading */}

        <h1
          className="text-5xl md:text-7xl font-black leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Neuro-Inclusive
          <br />

          <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            AI Assistant
          </span>
        </h1>

        {/* Subtitle */}

        <p className="section-subtitle max-w-2xl mx-auto mt-8 text-lg">

          Transform textbooks, lecture notes and messy thoughts into

          <span className="font-semibold text-violet-600 dark:text-violet-300">
            {" "}
            beautiful flashcards
          </span>

          , summaries and quizzes built for learners with ADHD, dyslexia and
          anyone who prefers studying one concept at a time.

        </p>

        {/* Feature Pills */}

        <div className="mt-12 flex flex-wrap justify-center gap-4">

          <div className="secondary-btn px-6 py-3 flex items-center gap-2">

            📚 Flashcards

          </div>

          <div className="secondary-btn px-6 py-3 flex items-center gap-2">

            📝 Summaries

          </div>

          <div className="secondary-btn px-6 py-3 flex items-center gap-2">

            ❓ Quiz Mode

          </div>

          <div className="secondary-btn px-6 py-3 flex items-center gap-2">

            🧠 Mind Maps

          </div>

        </div>

        {/* Decorative Circle */}

        <motion.div

          animate={{
            y: [0, -12, 0],
          }}

          transition={{
            repeat: Infinity,
            duration: 4,
          }}

          className="mt-14 flex justify-center"
        >

          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-2xl flex items-center justify-center">

            <Brain className="text-white" size={42} />

          </div>

        </motion.div>

      </motion.div>

    </section>
  );
}