import { SemanticScholarPaper } from '../types';

const API_BASE_URL = 'https://api.semanticscholar.org/graph/v1';

export const searchPapers = async (query: string, limit: number = 5): Promise<SemanticScholarPaper[]> => {
  if (!query) {
    return [];
  }

  const fields = 'title,abstract,authors,year,venue,url';
  const semanticScholarUrl = `${API_BASE_URL}/paper/search?query=${encodeURIComponent(query)}&limit=${limit}&fields=${fields}`;

  // Fix: Switched to a different CORS proxy to avoid Cloudflare blocks.
  const proxyUrl = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(semanticScholarUrl)}`;

  try {
    const response = await fetch(proxyUrl);
    const responseText = await response.text(); // Read the body as text first.

    // Fix: Add specific check for Cloudflare block page for better error handling.
    if (responseText.includes('<title>Attention Required! | Cloudflare</title>')) {
        throw new Error('The API request was blocked by a security service. Please wait a moment and try again.');
    }

    if (!response.ok) {
      // Handle non-2xx responses. The body might be plain text or JSON.
      throw new Error(responseText || `HTTP error! status: ${response.status}`);
    }

    // Now, try to parse the text. This is where parsing errors for non-JSON responses occur.
    try {
      const data = JSON.parse(responseText);
      return data.data || [];
    } catch (e) {
      // The response was 200 OK, but the body was not valid JSON.
      // This can happen if the proxy returns a plain text error (e.g., rate limiting, timeouts).
      if (responseText.includes('Too Many Requests')) {
        throw new Error('The search service is currently experiencing high traffic. Please wait a moment and try again.');
      }
      if (responseText.includes('Timeout')) {
         throw new Error('The request to the search service timed out. Please try again.');
      }
      // For any other parsing error, we throw a generic message.
      console.error('Failed to parse response JSON:', responseText);
      throw new Error('Received an invalid response from the search service.');
    }

  } catch (error) {
    console.error("Failed to fetch from Semantic Scholar API:", error);
    // Re-throw the specific error to be displayed in the UI.
    throw error;
  }
};