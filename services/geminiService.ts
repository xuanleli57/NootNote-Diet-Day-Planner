import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeFoodInput = async (input: string): Promise<FoodItem[]> => {
  if (!input.trim()) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following food input. Estimate calories, weight in grams, and calories per 100g. Return a JSON array. Input: "${input}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Short concise name of the food" },
              calories: { type: Type.NUMBER, description: "Total estimated calories for the item (number only)" },
              weight: { type: Type.NUMBER, description: "Estimated weight in grams (number only)" },
              calPer100g: { type: Type.NUMBER, description: "Calories per 100 grams" },
              protein: { type: Type.STRING, description: "Estimated protein (e.g., '5g')" },
              icon: { type: Type.STRING, description: "A single emoji representing the food" }
            },
            required: ["name", "calories", "weight", "calPer100g", "icon"]
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.map((item: any) => ({
        ...item,
        id: crypto.randomUUID()
      }));
    }
    return [];
  } catch (error) {
    console.error("Error analyzing food:", error);
    return [];
  }
};

export const generateMotivationalQuote = async (language: 'en' | 'zh'): Promise<string> => {
  try {
    const prompt = language === 'zh' 
      ? "Give me a very short, cute, motivational quote in Chinese for someone planning their day and diet. Max 10 words. No quotes."
      : "Give me a very short, cute, motivational quote in English for someone planning their day and diet. Max 10 words. No quotes.";

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text || (language === 'zh' ? "加油！" : "Noot Noot! You can do it!");
  } catch (e) {
    return language === 'zh' ? "坚持就是胜利！" : "Keep going!";
  }
}