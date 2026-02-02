import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { Config } from "../constants/Config";

const genAI = new GoogleGenerativeAI(Config.GEMINI_API_KEY);

export const analyzeImage = async (base64Data: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: Config.MODEL_NAME });
  const prompt =
    "Describe this scene in one concise, helpful sentence for someone who is visually impaired.";

  // Clean the base64 string
  const cleanBase64 = base64Data.split(",")[1] || base64Data;

  const imagePart: Part = {
    inlineData: { data: cleanBase64, mimeType: "image/jpeg" },
  };

  const result = await model.generateContent([prompt, imagePart]);
  return result.response.text();
};
