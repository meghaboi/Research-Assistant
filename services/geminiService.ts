import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeAbstract = async (abstract: string): Promise<string> => {
  if (!abstract) {
    return "No abstract available to summarize.";
  }

  const prompt = `
    You are an expert research assistant. Concisely summarize the following academic abstract for a researcher.
    Focus on the core problem, methodology, key findings, and contributions. The summary should be clear, informative, and no more than 4 sentences.
    
    Abstract: "${abstract}"
    Summary:
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing abstract with Gemini API:", error);
    return "Could not generate summary due to an error.";
  }
};

export const searchWeb = async (query: string): Promise<{
  summary: string;
  results: { title: string; uri: string }[];
}> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a brief summary and a list of the top 5 most relevant web links for the query: "${query}"`,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webResults = groundingChunks
      .map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!web && !!web.uri && !!web.title);

    return {
      summary: response.text,
      results: webResults,
    };
  } catch (error) {
    console.error("Error with Google Search grounding:", error);
    throw new Error("Failed to fetch web search results.");
  }
};

export const chatWithContext = async (context: string, message: string): Promise<string> => {
    const prompt = `
        Based on the following context, please answer the user's question.
        If the context doesn't contain the answer, state that you don't have enough information from the provided text.

        Context:
        ---
        ${context}
        ---

        User Question: ${message}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error with context chat:", error);
        return "Sorry, I encountered an error while processing your request.";
    }
}
