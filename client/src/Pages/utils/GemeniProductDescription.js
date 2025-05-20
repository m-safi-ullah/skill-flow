import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const GemeniProductDescription = async (productTitle) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Generate a comprehensive product description in simplee englist for "${productTitle}" related to non-technical skills. No need to add stericks. Add emojis to make it attractive. The description should be engaging and informative, highlighting the key features and benefits of the product.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const description = response.text().trim();

    return {
      success: true,
      description,
    };
  } catch (error) {
    console.error("Gemini generation error:", error);
    return {
      success: false,
      description:
        "Failed to generate product description. Please try again later.",
    };
  }
};

export default GemeniProductDescription;
