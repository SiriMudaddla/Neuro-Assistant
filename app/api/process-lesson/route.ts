import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 🔐 Strict Server-Side Key Loading (Completely hidden from browser inspection)
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("⚠️ SYSTEM WARNING: No secure server-side API key detected!");
}

const ai = new GoogleGenerativeAI(apiKey || "");

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // 🤖 Using the gemini-2.5-flash model for high-speed, reliable generation
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `
      You are an expert neuro-inclusive educational assistant. Your job is to help students with ADHD and dyslexia by breaking down dense study materials into highly structured, bite-sized micro-flashcards.
      
      Follow these strict formatting rules to optimize cognitive load:
      1. Create a clear list of flashcards processing the core ideas of the material.
      2. Each flashcard MUST be an absolute maximum of 1 to 3 short, punchy sentences. Never write long paragraphs.
      3. Return your final answer strictly as a valid JSON object matching this exact shape:
         {
           "flashcards": [
             "First micro-card text here.",
             "Second micro-card text here."
           ]
         }
      Do not wrap your response in markdown code blocks like \`\`\`json. Return only raw JSON.
    `;

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nStudy Material:\n${text}` }] }
      ]
    });

    const rawResponse = result.response.text().trim();

    // Clean up any accidental markdown wrapper artifacts if the AI returns them
    const cleanJsonString = rawResponse
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();

    const data = JSON.parse(cleanJsonString);
    
    return NextResponse.json({ flashcards: data.flashcards || [] });

  } catch (error: any) {
    console.error("Critical Gemini Backend Failure:", error);
    return NextResponse.json(
      { error: "Failed to process text. Check server configurations." },
      { status: 500 }
    );
  }
}