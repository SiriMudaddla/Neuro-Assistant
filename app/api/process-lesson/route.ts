import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
const secretToken = process.env.OPENAI_API_KEY || "";
const ai = new GoogleGenerativeAI(secretToken);
export async function POST(request: Request) {
  try {
    const { rawInput, ageGroup } = await request.json();

    const aiPrompt = `
      You are an assistant for students with dyslexia and ADHD. 
      Target Age Group: ${ageGroup}.
      
      Tasks:
      1. Fix any phonetic spelling errors or messy text in the input.
      2. Break the content down into small, digestible educational flashcards.
      3. No card can be longer than 3 sentences.
      4. Wrap key vocabulary terms in **bold markdown** so they catch the reader's eye.
      5. Start every card with a relevant emoji to act as a visual anchor.

      Return the result STRICTLY as a raw JSON array. Do not wrap it in markdown code blocks. 
      Use this exact structure:
      [
        { "id": 1, "content": "Visual emoji and short text summary here." }
      ]

      Source Text: "${rawInput}"
    `;

    let result;
    let rawResponse = "";

    try {
      // Strategy 1: Try the high-speed primary model first
      console.log("Attempting primary model: gemini-2.5-flash...");
      const primaryModel = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      result = await primaryModel.generateContent(aiPrompt);
      rawResponse = result.response.text();
    } catch (primaryError) {
      // Strategy 2: If the primary model is busy (503), automatically catch it and use the fallback
      console.warn("Primary model busy or failed. Swapping to fallback: gemini-1.5-flash...", primaryError);
      const fallbackModel = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      result = await fallbackModel.generateContent(aiPrompt);
      rawResponse = result.response.text();
    }
    
    // Safety formatting clean-up
    rawResponse = rawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
    const startIdx = rawResponse.indexOf("[");
    const endIdx = rawResponse.lastIndexOf("]") + 1;
    if (startIdx !== -1 && endIdx !== -1) {
      rawResponse = rawResponse.substring(startIdx, endIdx);
    }

    const flashcards = JSON.parse(rawResponse);
    return NextResponse.json({ flashcards });

  } catch (error: any) {
    console.error("Critical Gemini Backend Failure:", error);
    return NextResponse.json(
      { error: "Google's AI systems are currently overloaded. Please wait a moment and try again!" }, 
      { status: 503 }
    );
  }
}