
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Recommendation } from '../types';

const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getMenuRecommendation = async (preferences: string[]): Promise<Recommendation> => {
  const ai = getAi();
  try {
    // Step 1: Get menu name and description
    let prompt = `You are a helpful assistant that recommends a single lunch menu for Korean office workers.
The response must be in Korean.
Based on the following preferences: ${preferences.join(', ')}.
If no preferences are given, suggest a popular and generally liked lunch menu in Korea.
Please provide the response in a JSON format.`;

    const textResponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The name of the recommended Korean food menu."
            },
            description: {
              type: Type.STRING,
              description: "A short, appetizing description of the food."
            }
          },
          required: ["name", "description"]
        }
      }
    });

    const menuData = JSON.parse(textResponse.text);
    const { name, description } = menuData;

    if (!name) {
      throw new Error("Failed to get a valid menu name.");
    }

    // Step 2: Generate an image for the recommended menu
    const imagePrompt = `A delicious, professional, high-quality photograph of ${name}, Korean style dish, realistic food photography.`;
    
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: imagePrompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const imagePart = imageResponse.candidates?.[0]?.content?.parts?.[0];
    if (imagePart && imagePart.inlineData) {
      const base64Image = imagePart.inlineData.data;
      const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${base64Image}`;
      return { name, description, imageUrl };
    } else {
      // Fallback in case image generation fails
      return { name, description, imageUrl: `https://picsum.photos/seed/${name}/512/512` };
    }
  } catch (error) {
    console.error("Error getting menu recommendation:", error);
    throw new Error("추천 메뉴를 가져오는 데 실패했습니다. 다시 시도해 주세요.");
  }
};
