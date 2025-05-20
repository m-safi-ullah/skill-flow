import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const generateEnglishTest = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Generate 10 simple MCQs for an English grammar test.
      Output JSON only. Format:
      [{"question":"...","options":["A", "B", "C", "D"],"correct":1}]
      No markdown or explanations.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text().trim();

    // Remove markdown (```json or ```) if included
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(cleaned);

    return { success: true, questions };
  } catch (err) {
    console.error("Gemini MCQ Error:", err);
    return { success: false, questions: [] };
  }
};
