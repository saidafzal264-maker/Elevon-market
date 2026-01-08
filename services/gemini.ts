
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

// Always use named parameter and direct process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiRecommendations = async (history: string[], allProducts: Product[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User browsing history: ${history.join(", ")}. Available products: ${JSON.stringify(allProducts.map(p => ({ id: p.id, title: p.title })))}. Suggest the 3 best product IDs.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });
    // Property .text is used correctly (not a method)
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return [];
  }
};

export const smartSearch = async (query: string, allProducts: Product[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search query: "${query}". Products: ${JSON.stringify(allProducts.map(p => ({ id: p.id, title: p.title, description: p.description })))}. Return product IDs that best match the semantic intent of the query.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });
    // Property .text is used correctly (not a method)
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Search Error:", error);
    return [];
  }
};
